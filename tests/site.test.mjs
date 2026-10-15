import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)), '..');
const pageNames=['index.html','about.html','services.html','sectors.html','contact.html','thank-you.html'];
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
   const target=(file||name).split('?')[0];
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
 assert.match(css, /--navy: #0b1f3a/i);
 assert.match(css, /--gold-bright: #ebbd59/i);
 assert.match(css, /\.hero-copy \{ position: relative; background: #0b2342/i);
 assert.match(css, /\.page-intro \{ background: #0d2a4c/i);
 assert.match(content.get('index.html'), /class="hero-pathways"/);
 assert.match(content.get('index.html'), /class="estate-spotlight"/);
 assert.match(content.get('about.html'), /class="approach-panel"/);
 assert.doesNotMatch(allText, /images\.unsplash\.com|hero-graphic-title|sector-visual-fallback/);
});
test('unconfirmed brochure address or sample phone numbers not exposed',()=>{
 assert.doesNotMatch(allText, /123 Enterprise Drive|\+263\s*78\s*123\s*4567|\+263\s*71\s*234\s*5678/);
 assert.doesNotMatch(allText, /lorem ipsum|fake testimonial|\d+ completed projects|years of experience|trusted by hundreds/i);
});
test('Netlify enquiry form accepts visitors without email addresses',()=>{
 const contact=content.get('contact.html');
 assert.match(contact,/<form\b[^>]*name="website-enquiry"[^>]*data-netlify="true"/);
 assert.match(contact,/data-netlify-honeypot="bot-field"/);
 assert.match(contact,/name="form-name" value="website-enquiry"/);
 assert.match(contact,/method="POST" action="\/thank-you\.html"/);
 for(const field of ['name','phone','message','contact-consent']){
   const pattern=new RegExp(`<\\b(?:input|textarea)[^>]*name="${field}"[^>]*required`);
   assert.match(contact,pattern,field);
 }
 const email=contact.match(/<input[^>]*name="email"[^>]*>/)?.[0];
 assert.ok(email,'email field exists');
 assert.doesNotMatch(email,/\brequired\b/,'email must be optional');
 assert.match(contact,/name="service"/);
 assert.match(contact,/value="will-preparation"/);
 assert.match(contact,/do not include identification numbers/);
 assert.match(content.get('thank-you.html'),/Thank you for getting in touch/);
});
test('estate service directs interested visitors to preselected will enquiries',()=>{
 const s=content.get('services.html');
 assert.match(s,/id="estate"/);
 assert.match(s,/Let us help you prepare your will/);
 assert.match(s,/contact\.html\?service=will-preparation#enquiry/);
 assert.match(js,/URLSearchParams/);
});
test('primary enquiry navigation opens the contact form, and unsupported previews block submission',()=>{
 for(const html of content.values()) assert.match(html,/class="nav-enquiry" href="contact.html#enquiry"/);
 assert.match(js,/unsupportedPreview/);
 assert.match(js,/preventDefault/);
 assert.match(content.get('contact.html'),/id="form-preview-note"/);
});
test('homepage has a working-looking enquiry journey without email-only actions',()=>{
 const html=content.get('index.html');
 const main=html.split('<main id="main">')[1].split('</main>')[0];
 assert.doesNotMatch(main,/href="mailto:/,'homepage primary journeys must never require an email app');
 assert.match(main,/class="hero-pathways"/);
 assert.match(main,/contact\.html\?service=will-preparation#enquiry/);
 assert.match(main,/href="contact\.html#enquiry">Send an enquiry/);
 assert.match(main,/href="services\.html#governance"/);
});
test('no remote image dependence or fictitious social proof in generated pages',()=>{
 assert.doesNotMatch(allText,/unsplash|stock photography|project showcase|client testimonials|awards won/i);
 assert.doesNotMatch(allText,/hero-grid-num|hero-photo-rule|image-with-fallback/);
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
