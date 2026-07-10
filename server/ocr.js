import tesseract from 'node-tesseract-ocr';
import sharp from 'sharp';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { classifyBodyType } from '../shared/bodyCompositionMetrics.js';

// Xiaomi Mi Body Composition Scale screenshots use a comma as the decimal separator
// ("64,2", "-2,6") because the phone's locale is Vietnamese — parseFloat alone would
// truncate at the comma, so normalize to a dot first.
function parseLocaleNumber(text) {
  if (text === undefined || text === null) return null;
  let cleaned = String(text)
    .replace(/[−–—=]/g, '-') // Unicode minus/en-dash/em-dash, plus a bare "=" (Tesseract's
    // most common misread of "-" directly against a digit, e.g. "Weight control: =2,6 kg")
    .replace(/,/g, '.')
    .replace(/[^\d.+-]/g, '');
  // Every value on this report is formatted to exactly one decimal digit ("37.2", "11.5",
  // "49.9"...), never two. A second decimal digit showing up ("37.24", "11.59" — both seen in
  // real scans) is Tesseract hallucinating/misreading one extra trailing digit onto an otherwise
  // correctly-read number, not a genuinely more precise reading — so it's dropped, not rounded
  // (rounding "11.59" would give 11.6, but the real value is 11.5).
  const dot = cleaned.indexOf('.');
  if (dot !== -1 && cleaned.length - dot - 1 > 1) cleaned = cleaned.slice(0, dot + 2);
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function escapeRegex(label) {
  return label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Tesseract doesn't reliably preserve spaces between words ("Fat control" -> "Fatcontrol"), so
// every multi-word label is matched with `\s*` between words instead of a literal space — which
// means the matched span's length can differ from the label string's own length, so callers must
// use the actual match length (returned here) rather than assume `label.length`.
function findLabel(text, label, fromIndex = 0) {
  const re = new RegExp(label.split(' ').map(escapeRegex).join('\\s*'), 'i');
  const match = re.exec(text.slice(fromIndex));
  if (!match) return null;
  return { index: fromIndex + match.index, end: fromIndex + match.index + match[0].length };
}

// The report screenshot is dark mode (light text on dark background). Tesseract is tuned for
// dark text on light backgrounds, so raw dark-mode screenshots OCR poorly — negating the image
// makes it look like normal light-mode text, which measurably improves recognition. Greyscale
// strips the color tinting on grade badges/section headers that otherwise confuses character
// segmentation; normalize spreads the contrast range; sharpen crisps up small card-label text.
async function preprocessForOcr(imagePath) {
  const outPath = path.join(os.tmpdir(), `bodycomp-ocr-${Date.now()}-${Math.round(Math.random() * 1e6)}.png`);
  await sharp(imagePath)
    .negate({ alpha: false })
    .greyscale()
    .normalize()
    .sharpen()
    .png()
    .toFile(outPath);
  return outPath;
}

// Every value on the report is either a plain non-negative measurement or (for the three
// "weight suggestions" deltas) explicitly signed. Anything outside these ranges is physically
// impossible for a human body reading and is almost always a misattributed delta/noise token —
// returning null lets the confirm-form leave the field blank instead of showing a wrong number
// with false confidence.
const PLAUSIBLE_RANGES = {
  weight_kg: [20, 300],
  body_score: [0, 100],
  bmi: [10, 60],
  body_fat_percent: [3, 60],
  body_water_mass_kg: [10, 100],
  fat_mass_kg: [1, 150],
  bone_mineral_mass_kg: [0.5, 10],
  protein_mass_kg: [3, 40],
  muscle_mass_kg: [10, 120],
  muscle_percent: [20, 90],
  body_water_percent: [30, 80],
  protein_percent: [5, 35],
  bone_mineral_percent: [1, 10],
  skeletal_muscle_kg: [5, 60],
  visceral_fat_rating: [1, 30],
  bmr_kcal: [500, 4000],
  waist_hip_ratio: [0.5, 1.5],
  body_age: [5, 100],
  fat_free_weight_kg: [10, 150],
  heart_rate_bpm: [30, 220],
  standard_weight_kg: [20, 200]
};

function plausible(key, value) {
  if (value === null || value === undefined || Number.isNaN(value)) return false;
  const range = PLAUSIBLE_RANGES[key];
  if (!range) return true;
  return value >= range[0] && value <= range[1];
}

// Tesseract consistently mangles the small up/down delta figures next to each metric
// ("↓0.3", "↑0.1"...) into a 3-digit token shaped like "10X" (the arrow + "0" + "." collapse
// into "1" and "0", leaving the real last digit). No real metric on this report is a bare
// number in [100,109], so this is a safe, sample-verified way to drop delta noise before it
// gets mistaken for an actual field value.
function isDeltaNoise(value) {
  return value !== null && value >= 100 && value <= 109 && Number.isInteger(value);
}

// Tesseract sometimes drops the decimal point on a 2-3 digit integer ("49.9" -> "499"). Only
// applied as a fallback when the raw reading fails the plausible range for this metric — if the
// raw value already made sense, trust it as-is rather than second-guessing a correct read.
function recoverLostDecimal(rawValue) {
  if (rawValue === null || !Number.isInteger(rawValue) || rawValue < 100 || rawValue > 9999) return null;
  const str = String(rawValue);
  return Number(`${str.slice(0, -1)}.${str.slice(-1)}`);
}

// Longer/more specific grade words must be checked before short ones that are their
// substring ("Very high" before "High") to avoid a short match masking the real word.
const GRADE_WORDS = ['Very high', 'Dangerous', 'Standard', 'Under', 'Over', 'High', 'Normal', 'Good', 'Fit'];

function findGradeWords(text, count) {
  const re = new RegExp(`\\b(${GRADE_WORDS.join('|')})\\b`, 'gi');
  const found = [];
  let match;
  while (found.length < count && (match = re.exec(text))) found.push({ word: match[1], index: match.index, end: match.index + match[1].length });
  return found;
}

// Every real value on the report is separated from surrounding text by whitespace or punctuation
// ("49.9 kg", "95 bpm", "17.9%") — verified across every real OCR sample collected so far, never
// a letter touching the digits directly. The mangled delta-arrow glyphs ("↓0.3", "↑0.1") are the
// opposite: Tesseract runs them straight into an adjacent letter with no space ("V0.3", "10s",
// "T01"), because the arrow character itself gets misread as that letter. So a number with a
// letter glued to either side — regardless of what value it parses to — is delta noise, not a
// real field value.
function isGluedToLetter(fullText, index, length) {
  const before = fullText[index - 1];
  const after = fullText[index + length];
  return /[a-zA-Z]/.test(before || '') || /[a-zA-Z]/.test(after || '');
}

// Pulls every number-like token out of `fullText[from:to]`, in left-to-right order, tagged with
// its absolute offset in the full OCR'd text (used to stop a later field from re-claiming a token
// an earlier field already consumed).
function numberTokens(fullText, from, to) {
  const matches = [...fullText.slice(from, to).matchAll(/([+-]?[0-9]+[.,][0-9]+|[+-]?[0-9]+)/g)];
  return matches.map((m) => {
    const index = from + m.index;
    return { raw: m[1], index, value: parseLocaleNumber(m[1]), glued: isGluedToLetter(fullText, index, m[1].length) };
  });
}

// Resolves one field's value against its plausible range, trying a lost-decimal recovery before
// giving up. Returns null (never a guess outside the physically sane range) on failure.
//
// A token glued to a letter (see isGluedToLetter) is trusted only through the lost-decimal path,
// never taken at face value. Reasoning from real samples: the one case where a genuine value gets
// glued to a letter is a *lost decimal point AND lost unit space together* ("49.9 kg" -> "499g"),
// which always fails the raw plausible check and only passes after recovery. Every glued token
// that passes the raw check as-is, in every real sample collected so far, has turned out to be a
// mangled delta arrow ("↓0.3" -> "10s") that happens to also land in some *other* metric's valid
// range — e.g. the noise value 10 is a perfectly plausible protein_percent on its own. So a glued
// token passing the raw check is treated as suspect noise, not a free pass.
function resolveValue(key, rawValue, glued = false) {
  if (plausible(key, rawValue)) return glued ? null : rawValue;
  const recovered = recoverLostDecimal(rawValue);
  if (plausible(key, recovered)) return recovered;
  return null;
}

// The report renders each stat pair ("BMI"/"Body fat percentage", "Muscle mass"/"Muscle
// percentage", ...) as two cards side by side, with each card's large-font value sitting in its
// own visual row ABOVE both labels. Verified against real Tesseract output (not simulated): for
// every single one of these rows, Tesseract reads BOTH cards' values first, then BOTH cards'
// labels second — "22.7 [delta] 17.9% [delta]\nBMI Standard Body fat [delta] Standard
// percentage" — never label-then-value per card. A per-metric sequential cursor breaks on this,
// because by the time the second label is found, its own value has already scrolled behind the
// cursor (consumed as if it belonged to the first field). Reading the row as a pair — locate
// both labels first, then zip the first two *plausible* numbers found before them, in that same
// left-to-right order — matches this consistently-grouped ordering. It does NOT generalize to a
// hypothetical label-then-value-per-card ordering; if a future device/report renders rows that
// way instead, this needs a different strategy, not just a tweak.
class ReportParser {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.claimed = new Set();
  }

  advanceTo(label) {
    const found = findLabel(this.text, label, this.pos);
    if (found) this.pos = found.end;
  }

  // Single metric with no sibling on its row (weight, body score, and everything after the
  // 2-column grid ends). Takes the nearest unclaimed, plausible number before `label`.
  single(key, label, { window = 60, hasGrade = true } = {}) {
    const found = findLabel(this.text, label, this.pos);
    if (!found) return { value: null, grade: null };
    const tokens = numberTokens(this.text, this.pos, found.index).filter((t) => !this.claimed.has(t.index) && !isDeltaNoise(t.value));
    let value = null;
    for (let i = tokens.length - 1; i >= 0; i -= 1) {
      const resolved = resolveValue(key, tokens[i].value, tokens[i].glued);
      if (resolved !== null) { value = resolved; this.claimed.add(tokens[i].index); break; }
    }
    this.pos = found.end;
    if (!hasGrade) return { value, grade: null };
    const after = this.text.slice(found.end, found.end + window);
    const [grade] = findGradeWords(after, 1);
    if (grade) this.pos = found.end + grade.end;
    return { value, grade: grade ? grade.word : null };
  }

  // Paired row: `defs` is [{key, label, hasGrade}, {key, label, hasGrade}] in on-report order.
  pair(defs) {
    const searchFrom = this.pos;
    const found = defs.map((d) => findLabel(this.text, d.label, searchFrom));
    if (found.some((f) => f === null)) {
      this.advanceTo(defs[defs.length - 1].label);
      return defs.map(() => ({ value: null, grade: null }));
    }
    const rowStart = Math.min(...found.map((f) => f.index));
    const rowLabelEnd = Math.max(...found.map((f) => f.end));

    const tokens = numberTokens(this.text, searchFrom, rowStart).filter((t) => !this.claimed.has(t.index) && !isDeltaNoise(t.value));

    const values = [];
    let cursor = 0;
    for (const def of defs) {
      let value = null;
      for (let i = cursor; i < tokens.length; i += 1) {
        const resolved = resolveValue(def.key, tokens[i].value, tokens[i].glued);
        if (resolved !== null) { value = resolved; this.claimed.add(tokens[i].index); cursor = i + 1; break; }
      }
      values.push(value);
    }

    const gradeCount = defs.filter((d) => d.hasGrade !== false).length;
    const gradeWindow = this.text.slice(rowStart, rowLabelEnd + 40);
    const grades = findGradeWords(gradeWindow, gradeCount);
    let gradeCursor = 0;
    const results = defs.map((def) => {
      const grade = def.hasGrade === false ? null : (grades[gradeCursor++] || null);
      return { grade: grade ? grade.word : null };
    }).map((r, i) => ({ value: values[i], grade: r.grade }));

    const lastGrade = grades[grades.length - 1];
    this.pos = lastGrade ? rowStart + lastGrade.end : rowLabelEnd;
    return results;
  }
}

// The "Weight suggestions" section uses an inline "Label: Value" layout instead of the
// stacked value-then-label layout used everywhere else on the report.
function numberAfterLabel(text, label, { window = 20, signed = false } = {}) {
  const found = findLabel(text, label);
  if (!found) return null;
  const slice = text.slice(found.end, found.end + window);
  const match = slice.match(/([+\-=−–—]?\s?[0-9]+[.,][0-9]+|[+\-=−–—]?\s?[0-9]+)/);
  if (!match) return null;
  const value = parseLocaleNumber(match[1].replace(/\s/g, ''));
  return signed ? value : (value === null ? null : Math.abs(value));
}

// The report header shows "DD/MM/YYYY HH:mm" (device locale). Returns an ISO string for
// `logged_at`, or null if the date couldn't be found so the caller falls back to "now".
function extractLoggedAt(text) {
  const match = text.match(/([0-3]?[0-9])\/([0-1]?[0-9])\/(20[0-9]{2})\D+([0-2]?[0-9]):([0-5][0-9])/);
  if (!match) return null;
  const [, day, month, year, hour, minute] = match.map(Number);
  const date = new Date(year, month - 1, day, hour, minute);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function parseBodyCompositionText(text) {
  const result = {};
  const parser = new ReportParser(text);

  result.logged_at = extractLoggedAt(text);

  // Weight is the large standalone number at the very top of the report, before "Body score".
  const bodyScoreIdx = text.search(/Body score/i);
  const headerEnd = bodyScoreIdx === -1 ? 120 : bodyScoreIdx;
  const headerSlice = text.slice(0, headerEnd);
  const weightTokens = numberTokens(text, 0, headerEnd).filter((t) => resolveValue('weight_kg', t.value, t.glued) !== null);
  result.weight_kg = weightTokens.length ? resolveValue('weight_kg', weightTokens[weightTokens.length - 1].value, weightTokens[weightTokens.length - 1].glued) : null;
  const weightGradeMatch = headerSlice.match(/\b(Standard|Under|Over|High)\b/i);
  result.weight_grade = weightGradeMatch ? weightGradeMatch[1] : null;
  parser.advanceTo('Body score');

  // The big top-of-report weight figure is split across two differently-sized text elements
  // ("64" huge, ",2" small) — Tesseract sometimes reads the big "64" fine but drops the small
  // decimal entirely ("64;" with the "2" gone, not just misread). That precision is separately
  // encoded in the "Weight suggestions" identity (standard weight = weight + weight control), so
  // read those two values now and use them to fill in the missing decimal — but only when doing
  // so doesn't change the integer part, so a corrupted "Standard weight" digit (also seen in
  // production: "61,6" OCR'd as "67,6") can't inject a wildly wrong weight.
  const standardWeightRaw = numberAfterLabel(text, 'Standard weight');
  const weightControlRaw = numberAfterLabel(text, 'Weight control', { signed: true });
  if (result.weight_kg !== null && standardWeightRaw !== null && weightControlRaw !== null) {
    const refined = Number((standardWeightRaw - weightControlRaw).toFixed(1));
    if (plausible('weight_kg', refined) && Math.abs(refined - result.weight_kg) <= 1) {
      result.weight_kg = refined;
    }
  }

  ({ value: result.body_score } = parser.single('body_score', 'points', { window: 5, hasGrade: false }));

  const [bmi, bodyFat] = parser.pair([
    { key: 'bmi', label: 'BMI' },
    { key: 'body_fat_percent', label: 'Body fat' }
  ]);
  result.bmi = bmi.value; result.bmi_grade = bmi.grade;
  result.body_fat_percent = bodyFat.value; result.body_fat_grade = bodyFat.grade;

  parser.advanceTo('Body composition');
  ({ value: result.body_water_mass_kg } = parser.single('body_water_mass_kg', 'Body water mass', { hasGrade: false }));
  ({ value: result.fat_mass_kg } = parser.single('fat_mass_kg', 'Fat mass', { hasGrade: false }));
  ({ value: result.bone_mineral_mass_kg } = parser.single('bone_mineral_mass_kg', 'Bone mineral mass', { hasGrade: false }));
  ({ value: result.protein_mass_kg } = parser.single('protein_mass_kg', 'Protein mass', { hasGrade: false }));

  const [muscleMass, musclePercent] = parser.pair([
    { key: 'muscle_mass_kg', label: 'Muscle mass' },
    { key: 'muscle_percent', label: 'Muscle percentage' }
  ]);
  result.muscle_mass_kg = muscleMass.value; result.muscle_mass_grade = muscleMass.grade;
  result.muscle_percent = musclePercent.value; result.muscle_percent_grade = musclePercent.grade;

  const [bodyWaterPercent, proteinPercent] = parser.pair([
    { key: 'body_water_percent', label: 'Body water' },
    { key: 'protein_percent', label: 'Protein percentage' }
  ]);
  result.body_water_percent = bodyWaterPercent.value; result.body_water_percent_grade = bodyWaterPercent.grade;
  result.protein_percent = proteinPercent.value; result.protein_percent_grade = proteinPercent.grade;

  const [boneMineralPercent, skeletalMuscle] = parser.pair([
    { key: 'bone_mineral_percent', label: 'Bone mineral percentage' },
    { key: 'skeletal_muscle_kg', label: 'Skeletal muscle mass' }
  ]);
  result.bone_mineral_percent = boneMineralPercent.value; result.bone_mineral_percent_grade = boneMineralPercent.grade;
  result.skeletal_muscle_kg = skeletalMuscle.value; result.skeletal_muscle_grade = skeletalMuscle.grade;

  const [visceralFat, bmr] = parser.pair([
    { key: 'visceral_fat_rating', label: 'Visceral fat rating' },
    { key: 'bmr_kcal', label: 'Basal metabolic rate' }
  ]);
  result.visceral_fat_rating = visceralFat.value; result.visceral_fat_grade = visceralFat.grade;
  result.bmr_kcal = bmr.value; result.bmr_grade = bmr.grade;

  const [waistHip, bodyAge] = parser.pair([
    { key: 'waist_hip_ratio', label: 'waist-to-hip ratio' },
    { key: 'body_age', label: 'Body age', hasGrade: false }
  ]);
  result.waist_hip_ratio = waistHip.value; result.waist_hip_grade = waistHip.grade;
  result.body_age = bodyAge.value;

  const [fatFreeWeight, heartRate] = parser.pair([
    { key: 'fat_free_weight_kg', label: 'Fat-free body weight', hasGrade: false },
    { key: 'heart_rate_bpm', label: 'Heart rate' }
  ]);
  result.fat_free_weight_kg = fatFreeWeight.value;
  result.heart_rate_bpm = heartRate.value; result.heart_rate_grade = heartRate.grade;

  // The highlighted body-type cell is shown by background color, not distinct text — OCR only
  // sees the same 10 zone labels every time regardless of which one is actually lit up, so it
  // can't be read reliably from text alone. Pre-fill a best-effort guess from BMI + body fat
  // percent instead (see classifyBodyType) — the confirm form's dropdown still lets the user
  // correct it by eye if the guess lands on a boundary case the 2-axis approximation can't catch.
  result.body_type_zone = classifyBodyType(result.bmi, result.body_fat_percent);

  // Weight suggestions section — inline "Label: Value" layout, opposite direction from above.
  result.standard_weight_kg = standardWeightRaw;
  result.weight_control_kg = weightControlRaw;
  result.fat_control_kg = numberAfterLabel(text, 'Fat control', { signed: true });
  result.muscle_control_text = /keep weight/i.test(text) ? 'keep weight' : null;

  // "Standard weight" is a single OCR'd token with no delta/grade neighbor to sanity-check it
  // against, so a single-digit misread (a real one seen in production: "61,6" -> "67,6") sails
  // straight through the plausible-range check with no way to tell. But the report's own numbers
  // define an identity: standard weight = current weight + weight control (the control figure IS
  // the adjustment needed to reach standard). When both of those are available, use this identity
  // to override an OCR'd standard weight that disagrees by more than simple rounding noise.
  if (result.weight_kg !== null && result.weight_control_kg !== null) {
    const derived = Number((result.weight_kg + result.weight_control_kg).toFixed(1));
    if (plausible('standard_weight_kg', derived) && (result.standard_weight_kg === null || Math.abs(result.standard_weight_kg - derived) > 1.5)) {
      result.standard_weight_kg = derived;
    }
  }

  // The composition-mass cards (body water/fat/bone mineral/protein mass, in kg) sit right next
  // to the body silhouette graphic in small text that Tesseract frequently drops entirely — but
  // every one of them is the *same number* as its percentage counterpart further down the report
  // (which OCRs far more reliably, in plain card text away from the graphic), just expressed as a
  // fraction of body weight instead of a raw percentage. Only fills in what OCR actually missed;
  // an already-read mass value is trusted as-is rather than second-guessed against this estimate.
  if (result.weight_kg !== null) {
    const massFromPercent = (percent) => (percent === null ? null : Number((result.weight_kg * percent / 100).toFixed(1)));
    if (result.body_water_mass_kg === null) result.body_water_mass_kg = massFromPercent(result.body_water_percent);
    if (result.fat_mass_kg === null) result.fat_mass_kg = massFromPercent(result.body_fat_percent);
    if (result.bone_mineral_mass_kg === null) result.bone_mineral_mass_kg = massFromPercent(result.bone_mineral_percent);
    if (result.protein_mass_kg === null) result.protein_mass_kg = massFromPercent(result.protein_percent);
  }

  return result;
}

export async function ocrBodyCompositionImage(imagePath) {
  const processedPath = await preprocessForOcr(imagePath);
  try {
    const text = await tesseract.recognize(processedPath, { lang: 'eng', oem: 1, psm: 3 });
    return { fields: parseBodyCompositionText(text), rawText: text };
  } finally {
    fs.unlink(processedPath).catch(() => {});
  }
}
