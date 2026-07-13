#!/usr/bin/env python3
"""Precisely crop just '79 points' without surrounding text."""
import sys
from PIL import Image, ImageDraw
sys.path.insert(0, 'D:/Project/Gym-Note/server')

from paddleocr import PaddleOCR

image_path = 'D:/Project/Gym-Note/image test/IMG_4347.PNG'
img = Image.open(image_path)

print(f"Original image: {img.size}")

# Looking at the image, body score "79 points" is:
# - Below "Body score" label
# - To the LEFT side (not inline with right text)
# - Estimate position from visual inspection

# Try multiple precise crops, each smaller/tighter
crops = [
    ("Left side only (x=0-400, y=700-900)", (0, 700, 400, 900)),
    ("Left side tight (x=0-300, y=750-850)", (0, 750, 300, 850)),
    ("Very tight (x=0-250, y=780-820)", (0, 780, 250, 820)),
    ("Horizontal strip (x=0-500, y=750-850)", (0, 750, 500, 850)),
    ("Wider left (x=0-600, y=680-920)", (0, 680, 600, 920)),
]

ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    enable_mkldnn=False,
    text_detection_model_name='PP-OCRv6_small_det',
    text_recognition_model_name='PP-OCRv6_small_rec',
)

print("\n" + "="*80)
print("Precise body_score crops (LEFT side only, no right text):")
print("="*80)

best_result = None
best_conf = 0

for name, (x0, y0, x1, y1) in crops:
    crop = img.crop((x0, y0, x1, y1))
    crop_path = f'C:/Users/admin/AppData/Local/Temp/precise_bodyscore_{name.replace(" ", "_")}.png'
    crop.save(crop_path)

    print(f"\n{name}")
    print(f"  Size: {crop.size}")

    result = ocr.ocr(crop_path)
    for page in result:
        texts = page.get('rec_texts', [])
        scores = page.get('rec_scores', [])

        all_text = ' '.join(texts)
        print(f"  All text: {all_text}")

        # Check if contains "79" or "points"
        for text, score in zip(texts, scores):
            text_clean = text.strip()
            if '79' in text_clean or 'points' in text_clean.lower():
                print(f"    ✓ Found: [{score:.0%}] {text_clean}")
                if score > best_conf:
                    best_conf = score
                    best_result = text_clean

if best_result:
    print(f"\n✓ SUCCESS: Found '{best_result}' at {best_conf:.0%} confidence")
else:
    print(f"\n✗ FAILED: '79' or 'points' not found in any crop")
    print("\nAll detected content:")
    for page in result:
        for text, score in zip(page.get('rec_texts', []), page.get('rec_scores', [])):
            print(f"  [{score:.0%}] {text.strip()}")
