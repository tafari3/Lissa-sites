import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Safe, preview-only build until the ZCHPC enquiry endpoint is commissioned.
// An HTML POST to a static website must never look like a successful enquiry.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist-cloudpanel');
const source = join(root, 'dist');
execFileSync(process.execPath, [join(root, 'scripts', 'build.mjs')], {
  cwd: root, stdio: 'inherit', env: process.env
});
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const files = await readdir(source);
for (const file of files) {
  if (file === '_headers' || file === 'thank-you.html') continue; // Netlify-only; no unearned success page in staging.
  await cp(join(source, file), join(out, file), { recursive: true });
}
const contactFile = join(out, 'contact.html');
let contact = await readFile(contactFile, 'utf8');
const pattern = /<form\b[^>]*\bid="enquiry-form"[^>]*>[\s\S]*?<\/form>/g;
const matches = contact.match(pattern) || [];
if (matches.length !== 1 || !matches[0].includes('name="website-enquiry"')) {
  throw new Error('Expected exactly one Netlify contact form; refusing to ship');
}
const fallback = `<div class="enquiry-form" role="status" aria-live="polite" data-cloudpanel-enquiry-pending>
  <p class="kicker">DIRECT ENQUIRIES</p>
  <h3>Contact our team while online enquiries are being connected.</h3>
  <p>The secure website enquiry form is not yet accepting submissions. Please contact us directly using WhatsApp or telephone. You do not need an email address.</p>
  <p><a class="button button-primary" href="https://wa.me/263776224970" target="_blank" rel="noopener noreferrer">Message via WhatsApp <span aria-hidden="true">&#8599;</span></a></p>
  <p><a href="tel:+263776224970">Call +263 77 622 4970</a> or use the details alongside.</p>
</div>`;
contact = contact.replace(pattern, fallback);
contact = contact.replace('Send an enquiry using your phone or WhatsApp number. An email address is optional.', 'Reach our team by WhatsApp or telephone while secure online enquiries are being connected.');
contact = contact.replace('SEND AN ENQUIRY', 'CONTACT THE TEAM');
if (/<form\b|data-netlify=|website-enquiry/.test(contact)) {
  throw new Error('Staging contact page contains active form remnants');
}
await writeFile(contactFile, contact);
for (const name of ['index.html','services.html','sectors.html','about.html','will-drafting.html']) {
  const f = join(out,name);
  const page = await readFile(f,'utf8');
  await writeFile(f,page.replaceAll('Send an enquiry', 'Contact the team'));
}
const infoFile = join(out, 'release-info.json');
const info = JSON.parse(await readFile(infoFile, 'utf8'));
info.hosting = 'ZCHPC CloudPanel preview';
info.formMode = 'disabled-until-secure-endpoint-commissioned';
info.willSubmission = 'disabled';
info.indexing = 'disabled-client-review';
await writeFile(infoFile, JSON.stringify(info, null, 2) + '\n');
// Retain noindex + robots.txt. Remove neither until business/legal approval.
const rootFiles = await readdir(out);
if (rootFiles.some(name => name.startsWith('.') || name === 'scripts' || name === 'tests' || name === 'README.md' || name === '_headers')) {
  throw new Error('Forbidden repository/private content in CloudPanel package');
}
console.log('Prepared safe CloudPanel preview in dist-cloudpanel/ (no active enquiry POST)');
