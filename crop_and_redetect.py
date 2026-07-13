#!/usr/bin/env python3
"""Crop weight area and re-detect to debug why weight is missed."""
import sys
from PIL import Image
sys.path.insert(0, 'D:/Project/Gym-Note/server')

from ocr.paddleWorker import run_ocr

def test_crop(image_path, name):
    print(f"\n{'='*80}")
    print(f"{name}")
    print('='*80)

    # Load and show full image dimensions
    img = Image.open(image_path)
    print(f"Full image size: {img.size}")

    # Weight area is roughly top 600px of image (from visual inspection)
    # Crop to weight area
    weight_crop = img.crop((0, 0, img.width, 600))
    crop_path = f'C:/Users/admin/AppData/Local/Temp/weight_crop_{name.replace(" ", "_")}.png'
    weight_crop.save(crop_path)
    print(f"Cropped weight area (0, 0, {img.width}, 600) -> {crop_path}")

    # Detect on full image
    print("\n>>> Full image OCR (first 10 lines):")
    full_lines = run_ocr(image_path)
    for i, line in enumerate(full_lines[:10], 1):
        print(f"  {i}. [{line['conf']:.0%}] {line['text']:40s} | y0={line['y0']:4d}")

    # Detect on cropped area
    print("\n>>> Weight area crop OCR:")
    crop_lines = run_ocr(crop_path)
    for i, line in enumerate(crop_lines, 1):
        print(f"  {i}. [{line['conf']:.0%}] {line['text']:40s}")

    return full_lines, crop_lines

# Test both images
test_crop('D:/Project/Gym-Note/image test/IMG_3907.PNG', 'IMG_3907 (FAILED)')
test_crop('D:/Project/Gym-Note/image test/IMG_6596.PNG', 'IMG_6596 (SUCCESS)')
