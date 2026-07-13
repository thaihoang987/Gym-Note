// Single source of truth for body composition metrics (Xiaomi Mi Body Composition Scale report),
// shared by server/index.js (OCR field mapping + API) and src/main.jsx (charts + detail popup).
// `valueField`/`gradeField` are the body_composition_logs columns holding this metric's data.
export const BODY_COMPOSITION_METRIC_DEFS = [
  { key: 'weight', labelKey: 'bodycomp_weight', unit: 'kg', valueField: 'weight_kg', gradeField: 'weight_grade' },
  { key: 'bmi', labelKey: 'bodycomp_bmi', unit: '', valueField: 'bmi', gradeField: 'bmi_grade' },
  { key: 'body_fat', labelKey: 'bodycomp_body_fat', unit: '%', valueField: 'body_fat_percent', gradeField: 'body_fat_grade' },
  { key: 'muscle_mass', labelKey: 'bodycomp_muscle_mass', unit: 'kg', valueField: 'muscle_mass_kg', gradeField: 'muscle_mass_grade' },
  { key: 'muscle_percent', labelKey: 'bodycomp_muscle_percent', unit: '%', valueField: 'muscle_percent', gradeField: 'muscle_percent_grade' },
  { key: 'body_water_percent', labelKey: 'bodycomp_body_water_percent', unit: '%', valueField: 'body_water_percent', gradeField: 'body_water_percent_grade' },
  { key: 'protein_percent', labelKey: 'bodycomp_protein_percent', unit: '%', valueField: 'protein_percent', gradeField: 'protein_percent_grade' },
  { key: 'bone_mineral_percent', labelKey: 'bodycomp_bone_mineral_percent', unit: '%', valueField: 'bone_mineral_percent', gradeField: 'bone_mineral_percent_grade' },
  { key: 'skeletal_muscle', labelKey: 'bodycomp_skeletal_muscle', unit: 'kg', valueField: 'skeletal_muscle_kg', gradeField: 'skeletal_muscle_grade' },
  { key: 'visceral_fat', labelKey: 'bodycomp_visceral_fat', unit: '', valueField: 'visceral_fat_rating', gradeField: 'visceral_fat_grade' },
  { key: 'bmr', labelKey: 'bodycomp_bmr', unit: 'kcal', valueField: 'bmr_kcal', gradeField: 'bmr_grade' },
  { key: 'waist_hip', labelKey: 'bodycomp_waist_hip', unit: '', valueField: 'waist_hip_ratio', gradeField: 'waist_hip_grade' },
  { key: 'heart_rate', labelKey: 'bodycomp_heart_rate', unit: 'bpm', valueField: 'heart_rate_bpm', gradeField: 'heart_rate_grade' },
  { key: 'body_age', labelKey: 'bodycomp_body_age', unit: '', valueField: 'body_age', gradeField: null },
  { key: 'fat_free_weight', labelKey: 'bodycomp_fat_free_weight', unit: 'kg', valueField: 'fat_free_weight_kg', gradeField: null },
  { key: 'body_water_mass', labelKey: 'bodycomp_body_water_mass', unit: 'kg', valueField: 'body_water_mass_kg', gradeField: null },
  { key: 'fat_mass', labelKey: 'bodycomp_fat_mass', unit: 'kg', valueField: 'fat_mass_kg', gradeField: null },
  { key: 'bone_mineral_mass', labelKey: 'bodycomp_bone_mineral_mass', unit: 'kg', valueField: 'bone_mineral_mass_kg', gradeField: null },
  { key: 'protein_mass', labelKey: 'bodycomp_protein_mass', unit: 'kg', valueField: 'protein_mass_kg', gradeField: null }
];

export const BODY_COMPOSITION_METRIC_KEYS = new Set(BODY_COMPOSITION_METRIC_DEFS.map((def) => def.key));

export function bodyCompositionMetricDef(key) {
  return BODY_COMPOSITION_METRIC_DEFS.find((def) => def.key === key) || null;
}

// Maps a grade label text (as OCR'd from the scale report, e.g. "Standard", "Under", "Very high")
// to a semantic color tier — the report uses different wording per metric ("Standard" vs "Normal"
// vs "Fit" vs "Good" all mean the healthy middle band) but the same 4-tier color scheme throughout.
export function gradeColorTier(grade) {
  const value = String(grade || '').toLowerCase();
  if (!value) return null;
  if (value.includes('under')) return 'under';
  if (value.includes('dangerous') || value.includes('very high')) return 'danger';
  if (value.includes('high') || value.includes('over')) return 'warning';
  if (value.includes('standard') || value.includes('normal') || value.includes('fit') || value.includes('good')) return 'good';
  return null;
}

export const GRADE_TIER_COLORS = {
  under: '#3b82f6',
  good: '#22c55e',
  warning: '#eab308',
  danger: '#f97316'
};

// The body-type quadrant chart's highlighted cell is shown only by background color, which OCR
// can't read — this list backs a manual-pick dropdown so the user can correct the pre-filled
// guess from `classifyBodyType` below by looking at the photo.
export const BODY_TYPE_ZONES = ['Athletic', 'Overweight', 'Obese', 'Muscular', 'Fit', 'Slim & muscular', 'Slim', 'Invisibly obese', 'Lean', 'Underweight'];

// The quadrant chart plots BMI (Y axis) against body fat percentage (X axis). BMI's printed axis
// values (18.5/24.0) are fixed/universal — confirmed identical across 13 real reports spanning two
// different people (one male, one female, different ages). Body fat's printed axis values are
// NOT universal, though: the same reports show 10%/20% for the male but 18%/28% for the female —
// personalized by the scale itself, matching each person's own Under/Standard/Over grade
// boundaries. So instead of a fixed 10/20 split, this prefers the already-personalized grade text
// (`bodyFatGrade`, e.g. "Under"/"Standard"/"Over") whenever OCR read it, and only falls back to the
// fixed split when a caller has a raw percentage but no grade text (e.g. a manual/partial entry).
//
// This reproduces the resulting grid so the scan can pre-fill a best-effort zone instead of always
// leaving the dropdown on "--". It's still necessarily an approximation: the real chart has a finer
// 4-row split within the normal-BMI band (an extra "Slim & muscular"/"Slim" row above "Muscular"/
// "Fit", confirmed by the "Overweight" cell sitting in the *upper* of those two rows — see below),
// but nothing printed on the chart reveals the BMI threshold between the two rows, so both are
// treated as one "normal" band here — that nuance still collapses into whichever neighboring zone
// this picks. Verified against 2 real scans: BMI 22.7/body fat 17.9% -> "Fit", and BMI 22.9/body
// fat 32.1% (grade "Over", personalized axis 18%/28%) -> "Overweight", both matching the photo.
// The second case is why "normal" BMI + high fat maps to "Overweight" here, not "Invisibly obese"
// as an earlier version of this function guessed — real report data showed "Invisibly obese" only
// applies to the *lower* of the two normal-BMI rows (the one this function can't distinguish), not
// the whole band.
export function classifyBodyType(bmi, bodyFatPercent, bodyFatGrade) {
  if (!Number.isFinite(bmi)) return null;
  const bmiBand = bmi > 24 ? 'high' : bmi < 18.5 ? 'low' : 'normal';
  const fatTier = gradeColorTier(bodyFatGrade);
  const fatBand = fatTier === 'under' ? 'low' : fatTier === 'good' ? 'mid' : fatTier ? 'high'
    : Number.isFinite(bodyFatPercent) ? (bodyFatPercent > 20 ? 'high' : bodyFatPercent < 10 ? 'low' : 'mid') : null;
  if (!fatBand) return null;
  const grid = {
    high: { low: 'Athletic', mid: 'Overweight', high: 'Obese' },
    normal: { low: 'Muscular', mid: 'Fit', high: 'Overweight' },
    low: { low: 'Lean', mid: 'Slim', high: 'Underweight' }
  };
  return grid[bmiBand][fatBand];
}
