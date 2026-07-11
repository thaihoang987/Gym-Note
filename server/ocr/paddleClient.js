import { spawn, spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKER_SCRIPT = path.join(__dirname, 'paddleWorker.py');
// Model load (~3s import + ~3s construct) only happens once at worker startup, not per scan — the
// worker process is kept alive and reused across requests. Inference itself still takes ~15s per
// image on CPU, so the request timeout below has to comfortably clear that, not just process
// startup.
const REQUEST_TIMEOUT_MS = 90_000;

let cachedPythonBin = null;

// The production Docker image (Debian) only ever has `python3` — installed explicitly in the
// Dockerfile. Local dev on Windows commonly only has `python` (the Microsoft Store / python.org
// installer doesn't add a `python3` alias). Detected once via a cheap `--version` probe and cached,
// rather than hard-coding one name and making the other platform's dev setup fail with an opaque
// ENOENT.
function resolvePythonBin() {
  if (cachedPythonBin) return cachedPythonBin;
  const candidates = [process.env.PADDLE_OCR_PYTHON, 'python3', 'python'].filter(Boolean);
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['--version'], { stdio: 'pipe' });
    // Windows ships a fake `python`/`python3` "App Execution Alias" stub when no real interpreter
    // is installed — it launches and exits 0 with no Node-level spawn error, but only prints a
    // "install from the Microsoft Store" message, never a real version string. A bare "did spawn
    // without erroring" check treats that stub as a valid interpreter and only fails later, deep
    // inside the worker process with no useful error — checking the actual output up front catches
    // it immediately with a clear message instead.
    const output = `${probe.stdout || ''}${probe.stderr || ''}`;
    if (!probe.error && probe.status === 0 && /Python \d/.test(output)) {
      cachedPythonBin = candidate;
      return candidate;
    }
  }
  throw new Error(`No Python interpreter found (tried: ${candidates.join(', ')}) — required for body-composition scan OCR`);
}

let worker = null;
let requestSeq = 0;
const pending = new Map();

function spawnWorker() {
  // Without PYTHONIOENCODING, Python's stdin/stdout default to the OS locale encoding — on Windows
  // that's the console codepage (cp1252/850), not UTF-8, which silently mangles any non-ASCII byte
  // in a piped image path (e.g. Vietnamese folder names) before Python ever sees it.
  const env = { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' };
  const child = spawn(resolvePythonBin(), [WORKER_SCRIPT], { stdio: ['pipe', 'pipe', 'pipe'], env });
  const rl = createInterface({ input: child.stdout });
  rl.on('line', (line) => {
    let response;
    try {
      response = JSON.parse(line);
    } catch {
      return; // stray non-JSON stdout noise (a stray print from a dependency) — ignore rather than crash
    }
    const entry = pending.get(response.id);
    if (!entry) return;
    pending.delete(response.id);
    clearTimeout(entry.timer);
    if (response.error) entry.reject(new Error(response.error));
    else entry.resolve(response.lines);
  });
  // Model-loading progress/warnings go here too, which is why only the tail is kept — but on a
  // crash (missing paddleocr install, oneDNN incompatibility, etc.) this tail is the only place the
  // actual Python traceback shows up, so it's surfaced in the rejection below instead of discarded.
  let stderrTail = '';
  child.stderr.on('data', (chunk) => {
    stderrTail = (stderrTail + chunk.toString()).slice(-2000);
  });
  const failAllPending = (message) => {
    for (const [, entry] of pending) {
      clearTimeout(entry.timer);
      entry.reject(new Error(message));
    }
    pending.clear();
    if (worker === child) worker = null;
  };
  // A ChildProcess's 'error' event (spawn failure — bad binary, permission denied, etc.) crashes
  // the whole Node process with an uncaught exception if nothing is listening for it, taking down
  // the entire server over a single scan request rather than just failing that request.
  child.on('error', (err) => failAllPending(`Failed to run PaddleOCR worker: ${err.message}`));
  child.on('exit', (code) => {
    const detail = stderrTail.trim().split('\n').slice(-5).join('\n');
    failAllPending(`PaddleOCR worker exited unexpectedly (code ${code})${detail ? `: ${detail}` : ''}`);
  });
  return child;
}

function getWorker() {
  if (!worker) worker = spawnWorker();
  return worker;
}

// Runs PaddleOCR against `imagePath` via the persistent Python worker, returning the recognized
// text lines with position and confidence. Spawns the worker lazily on first call and reuses it
// for every later scan — restarting a fresh Python process (and reloading the model) per request
// would repay the ~6s import+construct cost every time, on top of the ~15s inference floor that's
// already the dominant cost.
export function runPaddleOcr(imagePath) {
  return new Promise((resolve, reject) => {
    const child = getWorker();
    const id = String(++requestSeq);
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error('PaddleOCR request timed out'));
    }, REQUEST_TIMEOUT_MS);
    pending.set(id, { resolve, reject, timer });
    child.stdin.write(`${JSON.stringify({ id, path: imagePath })}\n`, (err) => {
      if (err) {
        pending.delete(id);
        clearTimeout(timer);
        reject(err);
      }
    });
  });
}
