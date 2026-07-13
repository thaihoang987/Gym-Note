import { runPaddleOcr } from './ocr/paddleClient.js';
import { parseBodyCompositionLines } from './ocr/parseLines.js';

export { parseBodyCompositionLines } from './ocr/parseLines.js';

// Switched from Tesseract to PaddleOCR (see server/ocr/paddleClient.js + paddleWorker.py) after
// batch-verifying both against 6 real scans: Tesseract needed a hand-tuned negate/greyscale/
// sharpen preprocessing pass plus 4 separately-cropped report regions re-OCR'd and merged, and
// still silently misread several values with no independent way to catch it (confirmed via direct
// A/B testing that this wasn't a preprocessing problem — the same misreads reproduced on raw,
// unprocessed crops). PaddleOCR reads the whole screenshot directly with no cropping or
// preprocessing at all, gets every one of those same values right, and reports a confidence score
// per line that Python already filters low-confidence noise out with — eliminating the whole class
// of delta-arrow/glued-letter noise-filtering heuristics the Tesseract pipeline needed.
export async function ocrBodyCompositionImage(imagePath) {
  const lines = await runPaddleOcr(imagePath);
  const fields = parseBodyCompositionLines(lines);
  const rawText = lines
    .slice()
    .sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0)
    .map((l) => l.text)
    .join('\n');
  return { fields, rawText, rawRegionText: null };
}
