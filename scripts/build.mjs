import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { netlifyHeaderFile } from './security.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
// Explicit allowlist: do NOT deploy source templates, tests, repo metadata, drafts,
// private documents, or future staff-only material with the public website.
const pages = [
  'index.html', 'about.html', 'services.html', 'sectors.html',
  'contact.html', 'thank-you.html', 'will-drafting.html'
];
const assets = [
  'assets/styles.css', 'assets/site.js', 'assets/will-intake.js',
  'assets/serina-logo.png', 'assets/favicon.png', 'robots.txt'
];
const revision = process.env.COMMIT_REF || process.env.RELEASE_SHA || process.env.GITHUB_SHA || 'local-preview';
if (!/^(local-preview|[a-f0-9]{7,40})$/.test(revision)) {
  throw new Error('Invalid release SHA supplied');
}
const form = await readFile(join(root, 'contact.html'), 'utf8');
const will = await readFile(join(root, 'will-drafting.html'), 'utf8');
if (!form.includes('name="website-enquiry"') || !form.includes('data-netlify="true"') || !form.includes('data-netlify-honeypot="bot-field"')) {
  throw new Error('Required Netlify contact form contract is missing');
}
if (!will.includes('id="will-questionnaire"') || /<iframe\b|willintakeform\.netlify\.app/i.test(will)) {
  throw new Error('Native, local-only will questionnaire contract is missing');
}
await rm(out, { recursive: true, force: true });
for (const entry of [...pages, ...assets]) {
  const dest = join(out, entry);
  await mkdir(dirname(dest), { recursive: true });
  await cp(join(root, entry), dest);
}
await writeFile(join(out, '_headers'), netlifyHeaderFile());
await writeFile(join(out, 'release-info.json'), JSON.stringify({
  revision, stage: 'client-review', willSubmission: 'disabled',
  enquiryProvider: 'Netlify Forms (requires site-side form detection and live verification)'
}, null, 2) + '\n');
const entries = await readdir(out);
if (entries.some(name => name.startsWith('.') || name === 'scripts' || name === 'tests' || name === 'README.md')) {
  throw new Error('Non-public content found in publish directory');
}
console.log(`Prepared ${pages.length} HTML pages and ${assets.length} assets for Netlify (revision ${revision})`);
