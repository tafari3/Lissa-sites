import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)), '..');
const pageNames=['index.html','about.html','services.html','sectors.html','contact.html'];
const content=new Map(pageNames.map(name=>[name,readFileSync(join(root,name),'utf8')]));
const allText=[...content.values()].join('\n');
const js=readFileSync(join(root,'assets/site.js'),'utf8');
const css=readFileSync(join(root,'assets/styles.css'),'utf8');

for(const [name,html] of content){
 test(`${name}: meaningful landmarks, exactly one H1, useful title and metadata`,()=>{
  for(const tag of ['header','nav','main','footer','h1','title']) assert.match(html,new RegExp(`<${tag}(?:\\s|>)`),tag);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<meta name="description"/);
  assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
  assert.match(html,/<a class="skip-link" href="#main">/);
  assert.match(html,/<a class="brand" href="index\.html"/);
  assert.match(html,/aria-label="Primary navigation"/);
 });
 test(`${name}: all local destinations and anchors exist`,()=>{
  for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
   const link=m[1];
   if(link.startsWith('https://')||link.startsWith('mailto:')) continue;
   assert.ok(!link.startsWith('/')&&!link.startsWith('http:'),`avoid absolute path or insecure reference: ${link}`);
   const [file,fragment]=link.split('#');
   const target=file||name;
   assert.ok(existsSync(join(root,target)),`Missing target ${name} -> ${link}`);
   if(fragment){
    const dest=content.get(target)||readFileSync(join(root,target),'utf8');
    assert.ok(dest.includes(`id="${fragment}"`),`Missing anchor ${name} -> ${link}`);
   }
  }
 });
}

test('brochure services are fully represented',()=>{
 const s=content.get('services.html');
 for(const phrase of ['Land Use &amp; Development Planning','Environmental Consulting &amp; EIA','ESG, Climate &amp; Sustainability','Technical Design &amp; Infrastructure','Estate Planning &amp; Property Advisory','Governance, Legal &amp; Strategy']) assert.ok(s.includes(phrase),phrase);
});
test('client-provided additional services are included without inventing specialties',()=>{
 const s=content.get('services.html').toLowerCase();
 for(const phrase of ['spatial','strategy formulation','board training','asset valuation','auditing']) assert.ok(s.includes(phrase),phrase);
 assert.doesNotMatch(s,/financial auditing|independent auditor|certified auditors|audit certification/);
});
test('all six brochure sectors are represented',()=>{
 const s=content.get('sectors.html');
 for(const phrase of ['Fuel station developers','Commercial &amp; industrial developers','Residential estate developers','Individual landowners &amp; families','Mining &amp; energy sector','NGOs &amp; public-sector bodies']) assert.ok(s.includes(phrase),phrase);
});
test('site has actual client branding and no generic illustration assets',()=>{
 assert.match(content.get('index.html'),/src="assets\/serina-logo\.png"/);
 assert.ok(existsSync(join(root,'assets/serina-logo.png')));
 assert.ok(existsSync(join(root,'assets/favicon.png')));
 assert.doesNotMatch(allText,/architectural-study\.svg|planning-lines\.svg|serina-wordmark\.svg/);
 assert.match(css,/#152c3e/i);
});
test('unconfirmed brochure address or sample phone numbers not exposed',()=>{
 assert.doesNotMatch(allText, /123 Enterprise Drive|\+263\s*78\s*123\s*4567|\+263\s*71\s*234\s*5678/);
 assert.doesNotMatch(allText, /lorem ipsum|fake testimonial|\d+ completed projects|years of experience|trusted by hundreds/i);
});
test('contact uses a genuine mailto link rather than an inoperative form',()=>{
 assert.match(content.get('contact.html'),/mailto:info@serinabhasera\.co\.zw/);
 assert.doesNotMatch(allText,/<form\b|onclick="alert|href="#"/i);
});
test('mobile navigation includes accessible state and close actions',()=>{
 assert.match(js,/aria-expanded/);
 assert.match(js,/Escape/);
 assert.match(js,/is-open/);
 assert.match(js,/resize/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/:focus-visible/);
});
test('robots excludes staging from indexing',()=>{
 assert.match(readFileSync(join(root,'robots.txt'),'utf8'),/Disallow: \/\s*$/m);
});
