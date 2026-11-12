// Packs the starting content and page templates for the Work and case study pages:
//   content/case-studies/*.json + content/more-work/*.json + templates/*.html -> lib/site/defaults.json
//   lib/site/render.mjs -> public/admin/render.mjs (the admin panel's live preview uses the same renderer)
// The live pages show what is saved from /admin (Vercel Blob) and fall back to these defaults
// until the first save. Runs before every build; run it on its own with: npm run content
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalize } from '../lib/site/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const readJson = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => ({ slug: f.replace(/\.json$/, ''), ...JSON.parse(readFileSync(path.join(dir, f), 'utf8')) }))
    : [];

const content = normalize({
  cases: readJson(path.join(ROOT, 'content', 'case-studies')),
  more: readJson(path.join(ROOT, 'content', 'more-work')),
});

const templates = {
  case: readFileSync(path.join(ROOT, 'templates', 'case-study.html'), 'utf8'),
  work: readFileSync(path.join(ROOT, 'templates', 'work.html'), 'utf8'),
};

writeFileSync(path.join(ROOT, 'lib', 'site', 'defaults.json'), JSON.stringify({ ...content, templates }) + '\n');
copyFileSync(path.join(ROOT, 'lib', 'site', 'render.mjs'), path.join(ROOT, 'public', 'admin', 'render.mjs'));
console.log(`content: ${content.cases.length} case studies, ${content.more.length} more-work rows`);
