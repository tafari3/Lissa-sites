import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../assets/site.js', import.meta.url), 'utf8');
test('page has a coherent landmark and headline structure', () => {
  for (const tag of ['header','nav','main','footer','h1','title']) assert.match(html, new RegExp(`<${tag}(?:\\s|>)`));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="description"/);
});
test('all required page sections and links exist', () => {
  const sections = ['main','about','expertise','sectors','contact'];
  sections.forEach((id) => assert.match(html, new RegExp(`id="${id}"`)));
  for (const match of html.matchAll(/href="#([\w-]+)"/g)) assert.match(html, new RegExp(`id="${match[1]}"`));
});
test('all six brochure practice areas appear', () => {
  for (const heading of ['Land Use &amp; Development Planning','Environmental Consulting &amp; EIA','ESG, Climate &amp; Sustainability','Technical Design &amp; Infrastructure','Estate, Subdivision &amp; Asset Advisory','Governance, Legal &amp; Strategy']) assert.ok(html.includes(heading), heading);
});
test('additional client services are represented without inventing auditing specialty', () => {
  for (const phrase of ['Spatial planning','Strategy formulation','Board training','Valuation of assets','Auditing*']) assert.match(html.toLowerCase(), new RegExp(phrase.toLowerCase()));
  assert.doesNotMatch(html, /financial auditing|independent auditing|accredited auditor/i);
});
test('unconfirmed sample phone numbers and street address are not published', () => {
  assert.doesNotMatch(html, /\+263\s*(78\s*123\s*4567|71\s*234\s*5678)/);
  assert.doesNotMatch(html, /123 Enterprise Drive/i);
  assert.doesNotMatch(html, /lorem ipsum|coming soon|fake testimonial/i);
});
test('local imagery, stylesheet, and script are present', () => {
  for (const path of [...html.matchAll(/(?:src|href)="(assets\/[\w./-]+)"/g)].map(m=>m[1])) assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), path);
});
test('mobile navigation can open and close, including Escape', () => {
  assert.match(js, /aria-expanded/);
  assert.match(js, /Escape/);
  assert.match(js, /is-open/);
});
test('emails are mailto links and there is no misleading dead contact form', () => {
  assert.match(html, /mailto:info@serinabhasera\.co\.zw/);
  assert.doesNotMatch(html, /<form\b/i);
});

test('service enquiries and sector cards have real destinations', () => {
  assert.equal((html.match(/class="service-icon" href="#contact"/g) || []).length, 6);
  assert.equal((html.match(/class="sector" href="#contact"/g) || []).length, 6);
});
