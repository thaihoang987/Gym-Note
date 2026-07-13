#!/usr/bin/env python3
"""Invert image colors and try OCR."""
import sys
from PIL import Image, ImageOps
sys.path.insert(0, 'D:/Project/Gym-Note/server')

from paddleocr import PaddleOCR

image_path = 'D:/Project/Gym-Note/image test/IMG_4347.PNG'
img = Image.open(image_path)

print("Testing body_score detection with color inversion\n")
print("="*80)

# Test 1: Original
print("\n1. ORIGINAL (dark background, light text):")
lines = []
from ocr.paddleWorker import run_ocr
lines_orig = run_ocr(image_path)

found_79 = False
for line in lines_orig[:10]:
    print(f"   [{line['conf']:.0%}] {line['text'].strip()}")
    if '79' in line['text']:
        found_79 = True
        print("   ✓ FOUND 79!")

if not found_79:
    print("   ✗ 79 not found")

# Test 2: Invert entire image
print("\n2. FULL IMAGE INVERTED (light background, dark text):")
img_inverted = ImageOps.invert(img.convert('RGB'))
inverted_path = 'C:/Users/admin/AppData/Local/Temp/img_4347_inverted.png'
img_inverted.save(inverted_path)

ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    enable_mkldnn=False,
    text_detection_model_name='PP-OCRv6_small_det',
    text_recognition_model_name='PP-OCRv6_small_rec',
)

result = ocr.ocr(inverted_path)
found_79 = False
for page in result:
    texts = page.get('rec_texts', [])
    scores = page.get('rec_scores', [])
    for i, (text, score) in enumerate(zip(texts[:10], scores[:10]), 1):
        print(f"   {i}. [{score:.0%}] {text.strip()}")
        if '79' in text:
            found_79 = True
            print(f"   ✓ FOUND 79 at confidence {score:.0%}!")

if not found_79:
    print("   ✗ 79 not found")

# Test 3: Crop body_score area + invert
print("\n3. CROPPED BODY_SCORE AREA + INVERTED:")
crop = img.crop((0, 600, 1320, 1200))
crop_inverted = ImageOps.invert(crop.convert('RGB'))
crop_path = 'C:/Users/admin/AppData/Local/Temp/bodyscore_inverted.png'
crop_inverted.save(crop_path)

result = ocr.ocr(crop_path)
found_79 = False
for page in result:
    texts = page.get('rec_texts', [])
    scores = page.get('rec_scores', [])
    print(f"   Detected {len(texts)} lines:")
    for i, (text, score) in enumerate(zip(texts[:5], scores[:5]), 1):
        print(f"   {i}. [{score:.0%}] {text.strip()}")
        if '79' in text:
            found_79 = True
            print(f"   ✓ FOUND 79!")

if not found_79:
    print("   ✗ 79 not found")

print("\n" + "="*80)
if found_79:
    print("SUCCESS! Inversion helped detect '79'")
else:
    print("FAILED: Even with inversion, '79' not detected")
