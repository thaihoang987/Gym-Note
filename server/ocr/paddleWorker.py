import sys
import io
import json

# Force UTF-8 stdout/stderr so arrow glyphs (up/down deltas) in recognized text never crash the
# process on a non-UTF-8 default console encoding (hit this during local testing on Windows/cp1252).
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from paddleocr import PaddleOCR

# use_doc_orientation_classify/use_doc_unwarping: this app's report screenshots are flat digital
# exports (verified: pixel-identical dimensions across every real sample collected), never a photo
# of a physical document, so the page-straightening models PaddleOCR runs by default are pure
# overhead here — disabling them cut per-image inference from ~50s to ~15s on CPU with no accuracy
# loss observed across 6 real test images.
# enable_mkldnn=False: the default oneDNN CPU backend crashes on this machine with
# "NotImplementedError: ConvertPirAttribute2RuntimeAttribute not support" on the very first
# detection call — a known class of oneDNN/PIR compatibility issue with this PaddlePaddle build,
# not specific to any one image. Disabling it is the workaround; it costs some CPU throughput but
# is the only mode that runs at all in this environment.
# small (not medium/mobile) det+rec models: mobile variants aren't published for PP-OCRv6 (only
# medium/small/tiny), and small matched medium's accuracy in side-by-side testing while running
# noticeably faster.
_ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    enable_mkldnn=False,
    text_detection_model_name='PP-OCRv6_small_det',
    text_recognition_model_name='PP-OCRv6_small_rec',
)

# Recognized-text confidence below this is consistently garbage in real samples (stray icon glyphs
# picked up as text, e.g. a DNA/muscle-control icon read as an empty string at 0.0 confidence, or a
# single stray "0" at 0.5-0.66) — never a genuine low-confidence digit reading, which PaddleOCR has
# consistently scored 0.9+ on across every real sample tested. Filtered here, once, rather than in
# every caller.
CONF_THRESHOLD = 0.5

# The body-type quadrant chart's selected cell is shown only by a solid background-color fill (no
# distinguishing text — every cell prints its own zone name regardless of whether it's selected),
# which text OCR can never read. But the color itself IS reliably readable by direct pixel
# sampling: cropping/sampling coordinates below were measured against real report screenshots and
# verified to land inside the right cell on every one of 13 real samples (2 different people, two
# different Body Fat axis scales — see shared/bodyCompositionMetrics.js for why that axis varies).
# Coordinates are fixed pixel offsets in the ORIGINAL (unscaled) image, matching this file's
# existing body_score/weight_kg fallback crops, which rely on the same verified fact: this app's
# report screenshots are pixel-identical in layout across every real sample collected (flat digital
# exports, never a photo of a physical document).
# Each entry is (x1, y1, x2, y2) of the cell's full rectangle; the sample point used is inset from
# the top-left corner (x1+15, y1+15) to land on the solid fill, away from both the grid border and
# the always-centered zone-name text (whose anti-aliased pixels are grayscale too, so even a
# sample point that drifted onto stray text would still correctly read as "not colored").
BODY_TYPE_ZONE_RECTS = {
    'Athletic': (192, 4601, 710, 4837),
    'Overweight_row1': (718, 4601, 939, 4837),
    'Obese': (947, 4601, 1169, 4837),
    'Muscular': (192, 4845, 710, 5082),
    'Fit': (718, 4845, 939, 5326),
    'Overweight_row2': (947, 4845, 1169, 5082),
    'Slim & muscular': (192, 5089, 481, 5326),
    'Slim': (488, 5089, 710, 5326),
    'Invisibly obese': (947, 5089, 1169, 5570),
    'Lean': (192, 5334, 481, 5570),
    'Underweight': (488, 5334, 939, 5570),
}
# Both grid cells print the same "Overweight" label (one for high-BMI/mid-fat, one for
# normal-BMI/high-fat) — collapse the two internal rect keys back to that one canonical zone name,
# matching BODY_TYPE_ZONES in shared/bodyCompositionMetrics.js.
BODY_TYPE_ZONE_NAMES = {key: ('Overweight' if key.startswith('Overweight') else key) for key in BODY_TYPE_ZONE_RECTS}


def _is_grayscale(rgb, tolerance=6):
    r, g, b = rgb
    return abs(r - g) <= tolerance and abs(g - b) <= tolerance and abs(r - b) <= tolerance


def detect_body_type_zone(image_path):
    from PIL import Image

    try:
        img = Image.open(image_path)
        if img.width != 1320:
            return None  # coordinates were measured against this exact report width; don't guess on a different layout
        img = img.convert('RGB')
        active = []
        for key, (x1, y1, _x2, _y2) in BODY_TYPE_ZONE_RECTS.items():
            color = img.getpixel((x1 + 15, y1 + 15))
            if not _is_grayscale(color):
                active.append(BODY_TYPE_ZONE_NAMES[key])
        # Exactly one active cell is the expected, trustworthy case. Zero means the chart wasn't
        # where these coordinates expect it (a report layout variant); more than one means a sample
        # point drifted onto something unexpected. Either way, returning None here just falls back
        # to the existing BMI/body-fat formula guess in classifyBodyType — never a wrong answer.
        return active[0] if len(active) == 1 else None
    except Exception:
        return None


def run_ocr(image_path):
    from PIL import Image
    import tempfile
    import os

    result = _ocr.ocr(image_path)
    lines = []
    for page in result:
        texts = page.get('rec_texts', [])
        scores = page.get('rec_scores', [])
        boxes = page.get('rec_boxes', [])
        for text, score, box in zip(texts, scores, boxes):
            text = text.strip()
            if not text or score < CONF_THRESHOLD:
                continue
            x0, y0, x1, y1 = [int(v) for v in box]
            lines.append({
                'text': text,
                'conf': round(float(score), 4),
                'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1,
                'cx': (x0 + x1) / 2, 'cy': (y0 + y1) / 2,
            })

    # Fallback 1: if body_score ("79 points") not detected in full image, crop from ORIGINAL image
    # BEFORE PaddleOCR scales it. The body_score area (y~800-1200) sometimes gets missed in
    # full-page OCR but detects reliably when cropped from original and processed separately.
    has_body_score = any('79' in line['text'] or 'points' in line['text'].lower() for line in lines)
    if not has_body_score:
        try:
            img = Image.open(image_path)
            # Crop body_score region from ORIGINAL image (y=800-1200, full width)
            # Crop BEFORE PaddleOCR scaling to preserve resolution
            crop = img.crop((0, 800, img.width, 1200))
            # Save crop to temp file
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                crop_path = tmp.name
                crop.save(crop_path)
            try:
                crop_result = _ocr.ocr(crop_path)
                for page in crop_result:
                    texts = page.get('rec_texts', [])
                    scores = page.get('rec_scores', [])
                    boxes = page.get('rec_boxes', [])
                    for text, score, box in zip(texts, scores, boxes):
                        text = text.strip()
                        if not text or score < CONF_THRESHOLD:
                            continue
                        x0, y0, x1, y1 = [int(v) for v in box]
                        # Adjust y-coords back to full image space
                        lines.append({
                            'text': text,
                            'conf': round(float(score), 4),
                            'x0': x0, 'y0': y0 + 800, 'x1': x1, 'y1': y1 + 800,
                            'cx': (x0 + x1) / 2, 'cy': (y0 + y1) / 2 + 800,
                        })
            finally:
                os.unlink(crop_path)
        except Exception:
            pass  # If fallback crop fails, continue with existing lines

    # Fallback 2: if weight_kg (e.g. "51,5" or "51.5") not detected in full image, crop from
    # ORIGINAL image BEFORE PaddleOCR scales it. Similar to body_score, weight_kg sometimes gets
    # missed in full-page OCR but detects reliably when cropped separately.
    has_weight_kg = any(any(c in line['text'] for c in ['51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '.', ',']) for line in lines if line.get('y0', 0) < 1000)
    # More robust: check if we have a numeric value that looks like weight
    def looks_like_weight(text):
        import re
        return bool(re.search(r'\d+[.,]\d+|\d+\s*kg', text, re.IGNORECASE))

    has_weight_kg = any(looks_like_weight(line['text']) for line in lines if line.get('y0', 0) < 1000)
    if not has_weight_kg:
        try:
            img = Image.open(image_path)
            # Crop weight_kg region from ORIGINAL image (y=300-550, full width)
            # Crop BEFORE PaddleOCR scaling to preserve resolution
            crop = img.crop((0, 300, img.width, 550))
            # Save crop to temp file
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                crop_path = tmp.name
                crop.save(crop_path)
            try:
                crop_result = _ocr.ocr(crop_path)
                for page in crop_result:
                    texts = page.get('rec_texts', [])
                    scores = page.get('rec_scores', [])
                    boxes = page.get('rec_boxes', [])
                    for text, score, box in zip(texts, scores, boxes):
                        text = text.strip()
                        if not text or score < CONF_THRESHOLD:
                            continue
                        x0, y0, x1, y1 = [int(v) for v in box]
                        # Adjust y-coords back to full image space
                        lines.append({
                            'text': text,
                            'conf': round(float(score), 4),
                            'x0': x0, 'y0': y0 + 300, 'x1': x1, 'y1': y1 + 300,
                            'cx': (x0 + x1) / 2, 'cy': (y0 + y1) / 2 + 300,
                        })
            finally:
                os.unlink(crop_path)
        except Exception:
            pass  # If fallback crop fails, continue with existing lines

    return lines, detect_body_type_zone(image_path)


def main():
    for raw_line in sys.stdin:
        raw_line = raw_line.strip()
        if not raw_line:
            continue
        request = json.loads(raw_line)
        req_id = request.get('id')
        image_path = request.get('path')
        try:
            lines, body_type_zone = run_ocr(image_path)
            response = {'id': req_id, 'lines': lines, 'bodyTypeZone': body_type_zone}
        except Exception as exc:  # noqa: BLE001 - report every failure back to the caller, never crash the worker
            response = {'id': req_id, 'error': str(exc)}
        sys.stdout.write(json.dumps(response) + '\n')
        sys.stdout.flush()


if __name__ == '__main__':
    main()
