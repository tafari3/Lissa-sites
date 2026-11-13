import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'dist');
const output = join(root, 'dist-cloudpanel-production');
const publicDir = join(output, 'public');
const privateDir = join(output, 'private');
const sha = process.env.COMMIT_REF || '';
if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Production build requires exact COMMIT_REF (40 hex characters).');
execFileSync(process.execPath, [join(root, 'scripts', 'build.mjs')], { cwd: root, stdio: 'inherit', env: process.env });
await rm(output, {recursive: true, force: true});
await mkdir(publicDir, {recursive: true});
await mkdir(privateDir, {recursive: true});
for (const entry of await readdir(source)) {
  if (entry === '_headers' || entry === 'thank-you.html') continue;
  await cp(join(source, entry), join(publicDir, entry), {recursive: true});
}
const contactFile = join(publicDir, 'contact.html');
let contact = await readFile(contactFile, 'utf8');
if (!contact.includes('id="enquiry-form"') || !contact.includes('data-netlify="true"')) {
  throw new Error('Unexpected contact form markup. Refusing to produce production candidate.');
}
contact = contact.replace('action="/thank-you.html"', 'action="/api/contact.php"');
contact = contact.replace('data-netlify="true" data-netlify-honeypot="bot-field"', 'data-cloudpanel-production="true"');
contact = contact.replace('<input name="form-name" type="hidden" value="website-enquiry"/>', '<input type="hidden" name="csrf_token" value=""/>');
contact = contact.replace(/<p class="form-preview-note"[^>]*>[\s\S]*?<\/p>/, '<p id="enquiry-status" class="form-preview-note" hidden role="status" aria-live="polite"></p>');
contact = contact.replace('<script src="assets/site.js" defer></script>', '<script src="assets/site.js" defer></script>\n<script src="assets/cloudpanel-enquiry.js" defer></script>');
if (/data-netlify=|action="\/thank-you.html"|name="form-name"/.test(contact)) throw new Error('Legacy Netlify markers found in CloudPanel production contact');
await writeFile(contactFile, contact);
await cp(join(root, 'assets/cloudpanel-enquiry.js'), join(publicDir, 'assets/cloudpanel-enquiry.js'));
await mkdir(join(publicDir, 'api'), {recursive: true});
for (const name of ['csrf.php','contact.php']) {
  await cp(join(root, 'backend/public/api', name), join(publicDir, 'api', name));
}
for (const name of ['contact-lib.php','smtp-mailer.php','composer.json']) {
  await cp(join(root, 'backend/private', name), join(privateDir, name));
}
const info = JSON.parse(await readFile(join(publicDir,'release-info.json'),'utf8'));
Object.assign(info, {
  hosting: 'ZCHPC CloudPanel',
  stage: 'not-live-until-host-and-mail-commissioned',
  formMode: 'PHP authenticated SMTP, fail-closed until commissioned',
  enquiryProvider: 'ZCHPC PHP + verified TLS SMTP (configuration required)',
  willSubmission: 'disabled',
});
await writeFile(join(publicDir,'release-info.json'),JSON.stringify(info,null,2)+'\n');
await writeFile(join(output,'READ_FIRST.txt'),
  'DEPLOYMENT HOLD: This is a production candidate, NOT a live-verified website.\n'
  + 'Only contents of public/ belong in the verified CloudPanel document root.\n'
  + 'Only contents of private/ belong OUTSIDE the Nginx document root, owned by the site user.\n'
  + 'Install Composer PHPMailer 7.x inside private/, create private sessions/ and rate-limits/ (0700),\n'
  + 'set SERINA_PRIVATE_DIR, SERINA_ORIGIN, SERINA_RATE_SECRET, SERINA_SMTP_* and SERINA_MAIL_*,\n'
  + 'then set SERINA_MAIL_READY=1 only after live SMTP and endpoint testing succeeds.\n'
  + 'Verify PHP execution, Nginx rules, DNS, TLS, privacy, and real inbox readback BEFORE public cutover.\n'
  + 'If not commissioned, deploy the separate build:cloudpanel preview package instead.\n'
);
for (const name of ['.git','.env','vendor','README.md','tests','scripts','_headers']) {
  if ((await readdir(publicDir)).includes(name)) throw new Error('Private entry leaked into webroot: ' + name);
}
console.log('Built CloudPanel production candidate (public/ and private/ kept separate).');
