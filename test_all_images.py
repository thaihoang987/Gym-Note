#!/usr/bin/env python3
"""Test PaddleOCR on all body composition images in image test folder."""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / 'server'))

from ocr.paddleWorker import run_ocr
from ocr.parseLines import parseBodyCompositionLines


def test_image(image_path):
    """Test OCR on single image."""
    print(f"\n{'='*80}")
    print(f"Testing: {Path(image_path).name}")
    print('='*80)

    try:
        # Run OCR
        lines = run_ocr(image_path)
        print(f"✓ Detected {len(lines)} text lines")

        # Parse body composition
        result = parseBodyCompositionLines(lines)

        # Show results
        print("\nKey metrics:")
        metrics = [
            'weight_kg', 'body_score', 'bmi', 'body_fat_percent',
            'muscle_mass_kg', 'muscle_percent', 'fat_mass_kg', 'body_water_mass_kg',
            'bone_mineral_mass_kg', 'protein_mass_kg', 'visceral_fat_rating', 'bmr_kcal'
        ]

        missing = []
        for key in metrics:
            val = result.get(key)
            status = "✓" if val is not None else "✗"
            if val is None:
                missing.append(key)
            print(f"  {status} {key:30s}: {val}")

        if missing:
            print(f"\n⚠️  Missing {len(missing)} metrics: {', '.join(missing)}")
        else:
            print(f"\n✓ All metrics detected!")

        # Show derived fields
        if result.get('derived_fields'):
            print(f"\nDerived fields: {', '.join(result['derived_fields'])}")

        return len(missing) == 0

    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    test_dir = Path(__file__).parent / 'image test'
    images = sorted(test_dir.glob('*.PNG'))

    if not images:
        print("No images found in 'image test' folder")
        return

    print(f"Found {len(images)} test images")
    successful = 0

    for image in images:
        if test_image(str(image)):
            successful += 1

    print(f"\n{'='*80}")
    print(f"SUMMARY: {successful}/{len(images)} images fully parsed")
    print('='*80)


if __name__ == '__main__':
    main()
