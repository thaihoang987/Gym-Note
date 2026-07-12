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
async function runOnce(imagePath) {
  const lines = await runPaddleOcr(imagePath);
  const fields = parseBodyCompositionLines(lines);
  const rawText = lines
    .slice()
    .sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0)
    .map((l) => l.text)
    .join('\n');
  return { fields, rawText, rawRegionText: null };
}

// PaddleOCR's CPU inference isn't perfectly deterministic run-to-run on the exact same image — a
// production case confirmed this: scanning the identical photo twice returned weight_kg correctly
// (including via the standard-weight/weight-control identity fallback) the first time and null the
// second, with every other field reading correctly both times. Likely floating-point summation
// order varying across OpenMP-threaded CPU kernels between runs, occasionally tipping a borderline
// text-region detection/confidence score across the line-filtering threshold in paddleWorker.py.
// weight_kg is the one field this app auto-fills into the separate body-weight tracker on save
// (see POST /api/body-composition in server/index.js), so a single silent miss on it is worse than
// on any other field — worth a full second inference pass specifically to recover it, rather than
// leaving the user to notice and re-scan themselves.
export async function ocrBodyCompositionImage(imagePath) {
  const result = await runOnce(imagePath);
  if (result.fields.weight_kg !== null) return result;
  const retry = await runOnce(imagePath);
  return retry.fields.weight_kg !== null ? retry : result;
}
