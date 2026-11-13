import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../dist-cloudpanel/', import.meta.url);
const get = name => readFile(new URL(name, root), 'utf8');
const pages = ['index.html','about.html','services.html','sectors.html','contact.html','will-drafting.html'];

test('CloudPanel preview publish tree has allowlisted pages only', async () => {
 const items = await readdir(root);
 assert.deepEqual(items.sort(), [...pages, 'assets','release-info.json','robots.txt'].sort());
 const assets = await readdir(new URL('assets/',root));
 assert.deepEqual(assets.sort(), ['styles.css','site.js','will-intake.js','serina-logo.png','favicon.png','nevanji-mutumbwa.webp'].sort());
});

test('CloudPanel staging does not pretend to submit visitor data', async () => {
 const c = await get('contact.html');
 assert.doesNotMatch(c, /<form\b|data-netlify|action="\/thank-you.html"|website-enquiry/);
 assert.doesNotMatch(c, /Send an enquiry using your phone or WhatsApp number/);
 assert.match(c, /data-cloudpanel-enquiry-pending/);
 assert.match(c, /secure website enquiry form is not yet accepting submissions/);
 assert.match(c, /https:\/\/wa\.me\/263776224970/);
 assert.match(c, /tel:\+263776224970/);
});

test('native will preparation stays local and no external iframe', async () => {
 const w = await get('will-drafting.html');
 assert.match(w, /id="will-questionnaire"/);
 assert.doesNotMatch(w, /<iframe\b|willintakeform\.netlify\.app|data-netlify/);
 await stat(new URL('assets/will-intake.js',root));
});

test('retains approved photo-profile direction', async () => {
 const about = await get('about.html');
 assert.match(about, /Nevanji T\. Mutumbwa/);
 assert.match(about, /assets\/nevanji-mutumbwa\.webp/);
 const logo = await stat(new URL('assets/serina-logo.png',root));
 assert.ok(logo.size > 10000);
 const portrait = await stat(new URL('assets/nevanji-mutumbwa.webp',root));
 assert.ok(portrait.size > 10000);
});

test('keeps client-review indexing restrictions and accurate release mode', async () => {
 const info=JSON.parse(await get('release-info.json'));
 assert.match(info.revision, /^[a-f\d]{40}$/);
 assert.equal(info.formMode,'disabled-until-secure-endpoint-commissioned');
 assert.match(info.enquiryProvider,/disabled/);
 assert.doesNotMatch(info.enquiryProvider,/Netlify/);
 assert.equal(info.willSubmission,'disabled');
 assert.match(await get('robots.txt'), /Disallow:\s*\//);
 for(const page of pages) assert.match(await get(page), /name="robots" content="noindex, nofollow"/);
});
