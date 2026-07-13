#!/usr/bin/env python3
"""Extract body_score from original resolution crop."""
import sys
from PIL import Image
sys.path.insert(0, 'D:/Project/Gym-Note/server')

from paddleocr import PaddleOCR

image_path = 'D:/Project/Gym-Note/image test/IMG_4347.PNG'
img = Image.open(image_path)

print(f"Original image: {img.size}")

# Body score area: "79 points" is between "Body score" label and BMI section
# Based on visual inspection, it's around y=1000-1150 in the resized image
# In original: y0=993 for "Body score" label
# So body_score value should be slightly below it

# From visual: between line "Body score" (around 230px from top scaled)
# and first metric (BMI around 280px scaled)
# In original resolution: scale back up
# Let's estimate from visual: body_score "79" is around y=700-900 in original

regions_to_test = [
    ("Tight around 79", (200, 700, 1100, 900)),     # Just the "79 points" area
    ("Body score section", (0, 600, 1320, 1000)),   # Wider area
    ("Body score + context", (0, 500, 1320, 1200)), # Even wider
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
print("Testing body_score crops at ORIGINAL resolution:")
print("="*80)

for name, (x0, y0, x1, y1) in regions_to_test:
    crop = img.crop((x0, y0, x1, y1))
    crop_path = f'C:/Users/admin/AppData/Local/Temp/bodyscore_original_{name.replace(" ", "_")}.png'
    crop.save(crop_path)

    print(f"\n{name}")
    print(f"  Crop: ({x0}, {y0}, {x1}, {y1}) = {crop.size}")

    result = ocr.ocr(crop_path)
    for page in result:
        texts = page.get('rec_texts', [])
        scores = page.get('rec_scores', [])
        print(f"  Detected {len(texts)} lines:")
        for i, (text, score) in enumerate(zip(texts[:5], scores[:5]), 1):
            print(f"    {i}. [{score:.0%}] {text.strip()}")
