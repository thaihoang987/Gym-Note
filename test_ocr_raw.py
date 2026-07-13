#!/usr/bin/env python3
"""Test raw PaddleOCR on body composition images."""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / 'server'))

from ocr.paddleWorker import run_ocr


def test_image(image_path):
    """Test OCR on single image and show raw output."""
    name = Path(image_path).name
    print(f"\n{'='*80}")
    print(f"Testing: {name}")
    print('='*80)

    try:
        lines = run_ocr(image_path)
        print(f"✓ Detected {len(lines)} text lines\n")

        # Show all detected lines
        for i, line in enumerate(lines, 1):
            print(f"{i:2d}. [{line['conf']:5.2%}] {line['text']:40s} @ ({line['cx']:4.0f}, {line['cy']:4.0f})")

        return True

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

    print(f"Found {len(images)} test images\n")

    for image in images:
        test_image(str(image))

    print(f"\n{'='*80}")
    print("Done!")


if __name__ == '__main__':
    main()
