import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const jiti = require('jiti')(__filename);

const syllabus = jiti(path.join(__dirname, '../lib/syllabus.ts'));
const semesters = syllabus.SEMESTERS;

console.log(`Successfully imported ${semesters.length} semesters with ${syllabus.TOTAL_SUBJECTS} subjects!`);

const outDir = path.resolve(__dirname, '../pharmacode_app/assets/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outDir, 'syllabus.json'),
  JSON.stringify(semesters, null, 2),
  'utf-8'
);

console.log(`Saved syllabus.json (${(fs.statSync(path.join(outDir, 'syllabus.json')).size / 1024).toFixed(1)} KB)`);
