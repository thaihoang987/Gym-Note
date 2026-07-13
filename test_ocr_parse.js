#!/usr/bin/env node
/**
 * Test PaddleOCR parsing on all body composition images.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseBodyCompositionLines } from './server/ocr/parseLines.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PYTHON = 'py -3.13';
const PYTHON_SCRIPT = `
import sys, json
sys.path.insert(0, '${path.join(__dirname, 'server').replace(/\\/g, '\\\\')}')
from ocr.paddleWorker import run_ocr

image_path = sys.argv[1]
lines = run_ocr(image_path)
print(json.dumps(lines, ensure_ascii=False))
`;

async function testImage(imagePath) {
  const name = path.basename(imagePath);
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing: ${name}`);
  console.log('='.repeat(80));

  try {
    // Run Python OCR
    const lines = await runPython(imagePath);

    // Parse body composition
    const result = parseBodyCompositionLines(lines);

    // Show results
    const metrics = [
      'weight_kg', 'body_score', 'bmi', 'body_fat_percent',
      'muscle_mass_kg', 'muscle_percent', 'fat_mass_kg', 'body_water_mass_kg',
      'bone_mineral_mass_kg', 'protein_mass_kg', 'visceral_fat_rating', 'bmr_kcal',
      'waist_hip_ratio', 'body_age', 'fat_free_weight_kg', 'heart_rate_bpm'
    ];

    const missing = [];
    for (const key of metrics) {
      const val = result[key];
      const status = val !== null && val !== undefined ? '✓' : '✗';
      if (!val) missing.push(key);
      console.log(`  ${status} ${key.padEnd(30)} : ${val}`);
    }

    if (missing.length) {
      console.log(`\n⚠️  Missing ${missing.length} metrics: ${missing.join(', ')}`);
    } else {
      console.log(`\n✓ All metrics detected!`);
    }

    if (result.derived_fields?.length) {
      console.log(`Derived: ${result.derived_fields.join(', ')}`);
    }

    return missing.length === 0 ? 1 : 0;
  } catch (err) {
    console.log(`✗ Error: ${err.message}`);
    return 0;
  }
}

function runPython(imagePath) {
  return new Promise((resolve, reject) => {
    const args = ['-c', PYTHON_SCRIPT, imagePath];
    const proc = spawn(PYTHON.split(' ')[0], [...PYTHON.split(' ').slice(1), '-c', PYTHON_SCRIPT, imagePath]);

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data;
    });

    proc.stderr.on('data', (data) => {
      stderr += data;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        // Extract JSON from output (skip PaddlePaddle debug messages)
        const lines = stdout.split('\n');
        let json_line = '';
        for (const line of lines) {
          if (line.startsWith('[')) {
            json_line = line;
            break;
          }
        }
        if (!json_line) {
          throw new Error('No JSON output from Python script');
        }
        const lines_data = JSON.parse(json_line);
        resolve(lines_data);
      } catch (err) {
        reject(new Error(`Failed to parse Python output: ${err.message}`));
      }
    });
  });
}

async function main() {
  const testDir = path.join(__dirname, 'image test');
  const images = fs.readdirSync(testDir)
    .filter(f => f.match(/\.PNG$/i))
    .map(f => path.join(testDir, f))
    .sort();

  if (!images.length) {
    console.log('No images found in "image test" folder');
    return;
  }

  console.log(`Found ${images.length} test images\n`);

  let successful = 0;
  for (const image of images) {
    successful += await testImage(image);
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`SUMMARY: ${successful}/${images.length} images fully parsed`);
  console.log('='.repeat(80));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
