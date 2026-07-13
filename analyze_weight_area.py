#!/usr/bin/env python3
"""Analyze and compare weight areas from both images."""
import sys
from PIL import Image, ImageDraw, ImageStat
import numpy as np

def analyze_weight_area(image_path, name, y_range=(200, 550)):
    """Analyze weight area pixels and characteristics."""
    print(f"\n{'='*80}")
    print(f"{name}")
    print('='*80)

    img = Image.open(image_path)
    # Crop weight area
    crop = img.crop((0, y_range[0], img.width, y_range[1]))
    crop_array = np.array(crop)

    print(f"Image size: {img.size}")
    print(f"Weight area crop: (0, {y_range[0]}, {img.width}, {y_range[1]})")
    print(f"Crop size: {crop.size}")

    # Analyze color distribution
    if crop.mode == 'RGB':
        stat = ImageStat.Stat(crop)
        print(f"Mean RGB: ({stat.mean[0]:.1f}, {stat.mean[1]:.1f}, {stat.mean[2]:.1f})")
        print(f"Std RGB:  ({stat.stddev[0]:.1f}, {stat.stddev[1]:.1f}, {stat.stddev[2]:.1f})")

    # Count dark vs light pixels (assuming dark theme)
    # Dark pixels: RGB < 128
    dark_pixels = np.sum((crop_array[:,:,0] < 128) & (crop_array[:,:,1] < 128) & (crop_array[:,:,2] < 128))
    light_pixels = np.sum((crop_array[:,:,0] > 128) | (crop_array[:,:,1] > 128) | (crop_array[:,:,2] > 128))
    total_pixels = crop_array.shape[0] * crop_array.shape[1]

    print(f"Dark pixels (< 128): {dark_pixels/total_pixels*100:.1f}%")
    print(f"Light pixels (> 128): {light_pixels/total_pixels*100:.1f}%")

    # Check for text color (usually light on dark background)
    # Find dominant light colors (likely text)
    gray = crop.convert('L')
    gray_array = np.array(gray)
    light_text = np.sum(gray_array > 200)
    print(f"Very light pixels (> 200): {light_text/total_pixels*100:.2f}%")

    # Save crop for visual inspection
    save_path = f'C:/Users/admin/AppData/Local/Temp/weight_analysis_{name.replace(" ", "_")}.png'
    crop.save(save_path)
    print(f"Saved crop to: {save_path}")

# Analyze both
analyze_weight_area('D:/Project/Gym-Note/image test/IMG_3907.PNG', 'IMG_3907_(FAILED)')
analyze_weight_area('D:/Project/Gym-Note/image test/IMG_6596.PNG', 'IMG_6596_(SUCCESS)')
