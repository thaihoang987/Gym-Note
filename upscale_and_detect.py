#!/usr/bin/env python3
"""Upscale weight area and re-detect to improve recognition."""
import sys
from PIL import Image
sys.path.insert(0, 'D:/Project/Gym-Note/server')

from ocr.paddleWorker import run_ocr

def test_upscale(image_path, name):
    print(f"\n{'='*80}")
    print(f"{name}")
    print('='*80)

    img = Image.open(image_path)
    print(f"Original size: {img.size}")

    # Crop weight area
    weight_crop = img.crop((0, 0, img.width, 600))

    # Try different upscale factors
    for scale in [1.5, 2, 3]:
        new_size = (int(weight_crop.width * scale), int(weight_crop.height * scale))
        upscaled = weight_crop.resize(new_size, Image.LANCZOS)
        upscaled_path = f'C:/Users/admin/AppData/Local/Temp/upscale_{scale}x_{name.replace(" ", "_")}.png'
        upscaled.save(upscaled_path)

        print(f"\n>>> {scale}x Upscale ({new_size}) OCR:")
        lines = run_ocr(upscaled_path)
        for i, line in enumerate(lines[:5], 1):
            print(f"  {i}. [{line['conf']:.0%}] {line['text']:40s}")

# Test both images
test_upscale('D:/Project/Gym-Note/image test/IMG_3907.PNG', 'IMG_3907')
test_upscale('D:/Project/Gym-Note/image test/IMG_6596.PNG', 'IMG_6596')
