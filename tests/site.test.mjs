import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)), '..');
const pageNames=['index.html','about.html','services.html','sectors.html','contact.html','thank-you.html','will-drafting.html'];
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
   if(link.startsWith('https://')||link.startsWith('mailto:')||link.startsWith('tel:')) continue;
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
 assert.match(js, /classList\.add\('has-image'\)/);
 assert.match(allText, /hero-graphic-title/);
 assert.match(allText, /sector-visual-fallback/);
});
test('unconfirmed brochure address or sample phone numbers not exposed',()=>{
 assert.doesNotMatch(allText, /123 Enterprise Drive|\+263\s*78\s*123\s*4567|\+263\s*71\s*234\s*5678/);
 assert.doesNotMatch(allText, /lorem ipsum|fake testimonial|\d+ completed projects|years of experience|trusted by hundreds/i);
});
test('contact uses genuine mailto links with new tab target',()=>{
 assert.match(content.get('contact.html'),/mailto:nevanj@serinabhasera\.co\.zw/);
 assert.match(content.get('contact.html'),/mailto:victor@serinabhasera\.co\.zw/);
 assert.match(content.get('contact.html'),/target="_blank"/);
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
test('uploaded WhatsApp contacts and floating widget are present throughout the site',()=>{
 for(const [name,html] of content){
  assert.match(html, /https:\/\/wa\.me\/263776224970/);
  assert.match(html, /https:\/\/wa\.me\/263782295158/);
  assert.match(html, /id="wa-trigger"/);
  assert.match(html, /id="wa-popover"/);
 }
 assert.match(content.get('contact.html'), /contact-wa-link/);
 assert.match(css, /\.wa-widget/);
 assert.match(css, /\.wa-trigger/);
 assert.match(js, /wa-trigger/);
});



test('Netlify form is real, phone-first, and accepts visitors without email',()=>{
 const contact=content.get('contact.html');
 assert.match(contact,/<form[^>]*id="enquiry-form"/);
 assert.match(contact,/<form[^>]*data-netlify="true"/);
 assert.match(contact,/name="website-enquiry"/);
 assert.match(contact,/<input(?=[^>]*name="form-name")(?=[^>]*value="website-enquiry")[^>]*>/);
 assert.match(contact,/data-netlify-honeypot="bot-field"/);
 assert.match(contact,/<input[^>]*name="phone"[^>]*required|<input[^>]*required[^>]*name="phone"/);
 assert.match(contact,/<input(?=[^>]*type="email")(?=[^>]*name="email")(?![^>]*required)[^>]*>/);
 assert.match(contact,/<textarea[^>]*name="message"[^>]*required|<textarea[^>]*required[^>]*name="message"/);
 assert.match(contact,/<input[^>]*name="contact-consent"[^>]*required|<input[^>]*required[^>]*name="contact-consent"/);
 assert.match(contact,/name="location"/);
 assert.match(contact,/action="\/thank-you\.html"/);
});

test('will drafting enquiry survives the uploaded update',()=>{
 const s=content.get('services.html');
 assert.match(s,/Let us help you draft your will/);
 assert.match(s,/href="will-drafting.html"/);
 assert.match(s,/contact\.html\?service=will-preparation#enquiry/);
 assert.match(content.get('contact.html'),/value="will-preparation"/);
 assert.match(js,/new URLSearchParams\(window\.location\.search\)\.get\('service'\)/);
});

test('enquiry CTAs remain website form links rather than requiring mail',()=>{
 for(const html of content.values()) assert.match(html,/class="nav-enquiry" href="contact\.html#enquiry"/);
 assert.match(content.get('index.html'),/Send an enquiry/);
 assert.doesNotMatch(content.get('index.html'),/Email the firm/);
 assert.match(content.get('contact.html'),/Email <span class="optional">\(optional\)<\/span>/);
});

test('uploaded addresses and direct contact options are represented',()=>{
 const contact=content.get('contact.html');
 for(const item of ['nevanj@serinabhasera.co.zw','victor@serinabhasera.co.zw','151 Kwame Nkrumah Ave','Stand No. 965 Nemamwa']) assert.ok(contact.includes(item),item);
 assert.doesNotMatch(contact,/within 1.2 business days|typically review and acknowledge enquiries within/i);
});

test('no simulated successful form submissions survive the import',()=>{
 assert.doesNotMatch(js,/Your enquiry has been received/);
 assert.doesNotMatch(js,/contactForm\.reset\(/);
 assert.match(js,/unsupportedPreview/);
 assert.match(js,/event\.preventDefault\(\)/);
 assert.match(content.get('contact.html'),/id="form-preview-note"/);
});

test('WhatsApp popover supports dismissal and stays hidden when closed',()=>{
 assert.match(css,/\.wa-popover\[hidden\]\s*\{\s*display:\s*none/i);
 assert.match(js,/waTrigger\.addEventListener\('click'/);
 assert.match(js,/waClose\.addEventListener\('click'/);
 assert.match(js,/Escape/);
});

test('uploaded photo-based brand remains intact',()=>{
 const home=content.get('index.html');
 assert.match(home,/images\.unsplash\.com/);
 assert.match(home,/class="hero-image image-with-fallback"/);
 assert.match(home,/class="sector-image image-with-fallback"/);
});

test('CI workflow is retained and runs the site tests',()=>{
 const workflow=readFileSync(join(root,'.github/workflows/site-check.yml'),'utf8');
 assert.match(workflow,/npm run check/);
 assert.match(workflow,/python3 scripts\/build-pages\.py/);
});

test('our own will worksheet replaces the previous external embed',()=>{
 const will=content.get('will-drafting.html');
 const services=content.get('services.html');
 const script=readFileSync(join(root,'assets/will-intake.js'),'utf8');
 assert.match(services,/href="will-drafting.html"/);
 assert.match(will,/WILL &amp; TESTAMENT - PREPARATION QUESTIONNAIRE/);
 assert.match(will,/<div[^>]+id="will-questionnaire"[^>]+role="group"/);
 assert.doesNotMatch(will,/<form\b/);
 assert.match(will,/src="assets\/will-intake.js" defer/);
 for(const label of ['Start','Your details','Marital status','Spouse','Children','Bequests','Final wishes','Review']) assert.match(will,new RegExp(`<li[^>]*>${label}</li>`));
 assert.match(will,/name="wants_will" value="Yes" required/);
 assert.match(will,/name="wants_will" value="No" required/);
 assert.match(will,/id="will-step-review-title"/);
 assert.match(will,/id="will-print"/);
 assert.match(will,/id="will-clear"/);
 assert.match(will,/id="will-add-gift"/);
 for(const attr of ['data-will-step="0"','data-will-step="1"','data-will-step="2"','data-will-step="3"','data-will-step="4"','data-will-step="5"','data-will-step="6"','data-will-step="7"']) assert.ok(will.includes(attr),attr);
 assert.doesNotMatch(will,/<iframe\b|data-source=|Open original form|original questionnaire/i);
 assert.doesNotMatch(will,/<form[^>]*\saction=|<form[^>]*\smethod=/);
 assert.doesNotMatch(will,/data-netlify=|name="form-name"/);
 assert.doesNotMatch(allText + js + script + readFileSync(join(root,'scripts/build-pages.py'),'utf8') + readFileSync(join(root,'README.md'),'utf8'),/willintakeform\.netlify\.app/i);
 assert.doesNotMatch(script,/fetch\s*\(|XMLHttpRequest|sendBeacon\s*\(|localStorage\.|sessionStorage\.|\.submit\s*\(/);
 assert.match(script,/This is deliberately NOT an HTML form/);
 assert.match(script,/window\.print\(\)/);
 assert.match(script,/\.textContent = contents/);
 assert.match(script,/renderReview\(\)/);
 assert.match(script,/renumberGifts\(\)/);
 assert.match(css,/\.will-hero/);
 assert.match(css,/\.will-questionnaire/);
 assert.match(will,/proposed consultancy intake flow and require the firm/);
 assert.match(will,/Your answers are not transmitted/);
});

test('general Netlify enquiry is separate and remains phone-first',()=>{
 const contact=content.get('contact.html');
 const will=content.get('will-drafting.html');
 assert.match(contact,/<form[^>]+data-netlify="true"/);
 assert.match(contact,/name="phone"[^>]*required/);
 assert.match(contact,/value="will-preparation"/);
 assert.match(will,/contact\.html\?service=will-preparation#enquiry/);
 assert.doesNotMatch(will,/data-netlify="true"/);
});

test('print layout only hides other page content while printing will review',()=>{
 assert.match(content.get('will-drafting.html'),/<body id="top" class="will-page">/);
 assert.doesNotMatch(content.get('index.html'),/class="will-page"/);
 assert.match(css,/body\.will-page\.will-print-only \* \{ visibility: hidden/);
 assert.doesNotMatch(css,/(?<!\.)body \* \{ visibility: hidden/);
});
