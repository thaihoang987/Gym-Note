#!/usr/bin/env python3
"""Extract body_score from specific region."""
import sys
from PIL import Image
sys.path.insert(0, 'D:/Project/Gym-Note/server')

from ocr.paddleWorker import run_ocr

image_path = 'D:/Project/Gym-Note/image test/IMG_4347.PNG'
img = Image.open(image_path)

print(f"Image size: {img.size}")
print("\n" + "="*80)
print("Full image OCR (Body score area - first 15 lines):")
print("="*80)

lines = run_ocr(image_path)
for i, line in enumerate(lines[:15], 1):
    print(f"{i:2d}. [{line['conf']:.0%}] y0={line['y0']:4d} | {line['text']:40s}")

# Estimate body_score area (around y=300-500 based on visual inspection)
# After "Body score" label which should be around y=230
print("\n" + "="*80)
print("Trying different crop regions for body_score:")
print("="*80)

regions = [
    ("Small (y=250-400)", (0, 250, img.width, 400)),
    ("Medium (y=200-450)", (0, 200, img.width, 450)),
    ("Large (y=150-550)", (0, 150, img.width, 550)),
    ("Center only (x=100-600, y=250-400)", (100, 250, 600, 400)),
]

for name, box in regions:
    crop = img.crop(box)
    crop_path = f'C:/Users/admin/AppData/Local/Temp/bodyscore_{name.replace(" ", "_")}.png'
    crop.save(crop_path)

    print(f"\n{name} - {box}:")
    crop_lines = run_ocr(crop_path)
    for i, line in enumerate(crop_lines[:5], 1):
        print(f"  {i}. [{line['conf']:.0%}] {line['text']}")
