#!/usr/bin/env python3
"""Debug PaddleOCR - show all lines including filtered ones."""
import sys
sys.path.insert(0, 'D:/Project/Gym-Note/server')

from paddleocr import PaddleOCR

_ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    enable_mkldnn=False,
    text_detection_model_name='PP-OCRv6_small_det',
    text_recognition_model_name='PP-OCRv6_small_rec',
)

import sys
image_path = sys.argv[1] if len(sys.argv) > 1 else 'D:/Project/Gym-Note/image test/IMG_3907.PNG'
print(f"\n>>> Processing: {image_path}\n")
result = _ocr.ocr(image_path)

print("=" * 100)
print("ALL detected lines (including low confidence):")
print("=" * 100)

for page in result:
    texts = page.get('rec_texts', [])
    scores = page.get('rec_scores', [])
    boxes = page.get('rec_boxes', [])

    for i, (text, score, box) in enumerate(zip(texts, scores, boxes), 1):
        text_clean = text.strip()
        x0, y0, x1, y1 = [int(v) for v in box]
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2

        # Mark filtered lines
        status = " FILTERED (< 0.5)" if score < 0.5 else ""
        print(f"{i:3d}. [{score:5.2%}]{status:20s} | {text_clean:40s} | y0={y0:4d} cx={cx:4.0f}")

print("\n" + "=" * 100)
print("Lines in header area (y0 < 800):")
print("=" * 100)

for page in result:
    texts = page.get('rec_texts', [])
    scores = page.get('rec_scores', [])
    boxes = page.get('rec_boxes', [])

    for i, (text, score, box) in enumerate(zip(texts, scores, boxes), 1):
        text_clean = text.strip()
        x0, y0, x1, y1 = [int(v) for v in box]
        if y0 < 800:
            status = "[FILTERED]" if score < 0.5 else "[KEPT]"
            print(f"{i:3d}. [{score:5.2%}] {status} | {text_clean:40s} | y0={y0:4d} y1={y1:4d} x0={x0:4d}")

print("\n" + "=" * 100)
print("All lines sorted by Y position (showing first 50):")
print("=" * 100)

for page in result:
    texts = page.get('rec_texts', [])
    scores = page.get('rec_scores', [])
    boxes = page.get('rec_boxes', [])

    lines_sorted = sorted(zip(texts, scores, boxes), key=lambda x: (x[2][1], x[2][0]))
    for i, (text, score, box) in enumerate(lines_sorted[:50], 1):
        text_clean = text.strip()
        if not text_clean:
            continue
        x0, y0, x1, y1 = [int(v) for v in box]
        status = "[FILTERED]" if score < 0.5 else "[KEPT]"
        print(f"{i:3d}. [{score:5.2%}] {status} | {text_clean:40s} | y0={y0:4d}")
