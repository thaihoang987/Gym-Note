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


def run_ocr(image_path):
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
    return lines


def main():
    for raw_line in sys.stdin:
        raw_line = raw_line.strip()
        if not raw_line:
            continue
        request = json.loads(raw_line)
        req_id = request.get('id')
        image_path = request.get('path')
        try:
            lines = run_ocr(image_path)
            response = {'id': req_id, 'lines': lines}
        except Exception as exc:  # noqa: BLE001 - report every failure back to the caller, never crash the worker
            response = {'id': req_id, 'error': str(exc)}
        sys.stdout.write(json.dumps(response) + '\n')
        sys.stdout.flush()


if __name__ == '__main__':
    main()
