import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir, stat} from 'node:fs/promises';
const dir = new URL('../dist-cloudpanel-production/', import.meta.url);
const file = path => readFile(new URL(path, dir), 'utf8');

test('production artifact clearly separates public from confidential server code', async () => {
  assert.deepEqual((await readdir(dir)).sort(), ['READ_FIRST.txt','private','public'].sort());
  const names = await readdir(new URL('public/', dir));
  for (const forbidden of ['private', 'vendor', 'node_modules', '.env','.git', 'README.md','scripts','tests','_headers']) {
    assert.ok(!names.includes(forbidden), `Unexpected public content ${forbidden}`);
  }
  assert.deepEqual((await readdir(new URL('public/api/',dir))).sort(), ['contact.php','csrf.php']);
  assert.deepEqual((await readdir(new URL('private/',dir))).sort(), ['composer.json','contact-lib.php','smtp-mailer.php']);
});

test('CloudPanel form posts to server endpoint only, phone required and email optional', async () => {
  const html = await file('public/contact.html');
  assert.match(html, /action="\/api\/contact.php"/);
  assert.match(html, /name="csrf_token"/);
  assert.match(html, /data-cloudpanel-production="true"/);
  assert.match(html, /type="tel"[^>]*\/>/);
  assert.match(html, /for="enquiry-email">Email.*optional/);
  assert.match(html, /src="assets\/cloudpanel-enquiry.js"/);
  assert.doesNotMatch(html,/data-netlify=|name="form-name"|action="\/thank-you.html"/);
  assert.match(await file('public/assets/cloudpanel-enquiry.js'), /\/api\/csrf\.php/);
});

test('will privacy boundary unchanged and sensitive details do not enter enquiry', async () => {
  const html = await file('public/will-drafting.html');
  assert.match(html, /id="will-questionnaire"/);
  assert.doesNotMatch(html, /<form\b|<iframe\b|data-netlify=/);
  await stat(new URL('public/assets/will-intake.js',dir));
  const contact = await file('public/api/contact.php');
  assert.doesNotMatch(contact,/will-intake|bequest|beneficiar/i);
});

test('release metadata refuses to claim live production or enabled mail prematurely', async () => {
  const release = JSON.parse(await file('public/release-info.json'));
  assert.match(release.revision, /^[a-f\d]{40}$/);
  assert.match(release.stage, /^not-live-until-host-and-mail-commissioned$/);
  assert.match(release.formMode,/fail-closed/);
  assert.equal(release.willSubmission,'disabled');
  assert.match(await file('public/robots.txt'), /Disallow: \//);
  assert.doesNotMatch(await file('READ_FIRST.txt'), /password=|BEGIN PRIVATE KEY/);
});
