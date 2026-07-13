#!/usr/bin/env python3
"""Try image preprocessing to improve weight detection."""
import sys
from PIL import Image, ImageEnhance
import numpy as np
sys.path.insert(0, 'D:/Project/Gym-Note/server')

from ocr.paddleWorker import run_ocr

def preprocess_and_detect(image_path, name):
    """Test different preprocessing strategies."""
    print(f"\n{'='*80}")
    print(f"{name}")
    print('='*80)

    img = Image.open(image_path)
    crop = img.crop((0, 0, img.width, 600))  # Weight area

    # Original
    print("\n1. Original crop:")
    lines = run_ocr(crop)
    for i, line in enumerate(lines[:5], 1):
        print(f"  {i}. [{line['conf']:.0%}] {line['text']}")

    # Strategy 1: Increase contrast
    print("\n2. Contrast +50%:")
    enhanced = ImageEnhance.Contrast(crop).enhance(1.5)
    enhanced_path = f'C:/Users/admin/AppData/Local/Temp/contrast_{name.replace(" ", "_")}.png'
    enhanced.save(enhanced_path)
    lines = run_ocr(enhanced_path)
    for i, line in enumerate(lines[:5], 1):
        print(f"  {i}. [{line['conf']:.0%}] {line['text']}")

    # Strategy 2: Increase brightness
    print("\n3. Brightness +30%:")
    enhanced = ImageEnhance.Brightness(crop).enhance(1.3)
    enhanced_path = f'C:/Users/admin/AppData/Local/Temp/brightness_{name.replace(" ", "_")}.png'
    enhanced.save(enhanced_path)
    lines = run_ocr(enhanced_path)
    for i, line in enumerate(lines[:5], 1):
        print(f"  {i}. [{line['conf']:.0%}] {line['text']}")

    # Strategy 3: Convert to greyscale + enhance
    print("\n4. Greyscale + Contrast +50%:")
    grey = crop.convert('L')
    enhanced = ImageEnhance.Contrast(grey).enhance(1.5)
    enhanced_path = f'C:/Users/admin/AppData/Local/Temp/grey_contrast_{name.replace(" ", "_")}.png'
    enhanced.save(enhanced_path)
    lines = run_ocr(enhanced_path)
    for i, line in enumerate(lines[:5], 1):
        print(f"  {i}. [{line['conf']:.0%}] {line['text']}")

    # Strategy 4: CLAHE-like (local contrast enhancement)
    print("\n5. Sharpness +50%:")
    enhanced = ImageEnhance.Sharpness(crop).enhance(1.5)
    enhanced_path = f'C:/Users/admin/AppData/Local/Temp/sharp_{name.replace(" ", "_")}.png'
    enhanced.save(enhanced_path)
    lines = run_ocr(enhanced_path)
    for i, line in enumerate(lines[:5], 1):
        print(f"  {i}. [{line['conf']:.0%}] {line['text']}")

# Test
preprocess_and_detect('D:/Project/Gym-Note/image test/IMG_3907.PNG', 'IMG_3907')
