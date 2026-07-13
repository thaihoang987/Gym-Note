#!/usr/bin/env python3
"""
Test script for PaddleOCR body composition image parsing.
Usage: python test_paddle_ocr.py <image_path>
"""
import sys
import json
from pathlib import Path

# Add server directory to path for imports
sys.path.insert(0, str(Path(__file__).parent / 'server'))

from ocr.paddleWorker import run_ocr


def test_ocr(image_path):
    """Run OCR on the given image and display results."""
    if not Path(image_path).exists():
        print(f"Error: Image not found: {image_path}")
        return

    print(f"Testing OCR on: {image_path}")
    print("-" * 80)

    try:
        lines = run_ocr(image_path)

        print(f"\nDetected {len(lines)} lines:")
        print(json.dumps(lines, indent=2, ensure_ascii=False))

        # Group by text content
        print("\n" + "=" * 80)
        print("Detected text (sorted by position):")
        print("=" * 80)
        for i, line in enumerate(lines, 1):
            print(f"{i:2d}. [{line['conf']:.2f}] {line['text']:40s} @ ({line['cx']:4.0f}, {line['cy']:4.0f})")

    except Exception as e:
        print(f"Error during OCR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python test_paddle_ocr.py <image_path>")
        print("\nExample:")
        print("  python test_paddle_ocr.py test_image.png")
        sys.exit(1)

    test_ocr(sys.argv[1])
