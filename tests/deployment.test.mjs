import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { securityHeaders, willPageHeaders, netlifyHeaderFile } from '../scripts/security.mjs';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const read = p => readFileSync(join(root, p), 'utf8');
const publish = p => readFileSync(join(dist, p), 'utf8');

test('Netlify builds a private, allowlisted public directory rather than repository root', () => {
  const config = read('netlify.toml');
  assert.match(config, /publish\s*=\s*"dist"/);
  assert.match(config, /command\s*=\s*"npm run build"/);
  const allowedRoot = ['_headers', 'about.html', 'assets', 'contact.html', 'index.html', 'release-info.json', 'robots.txt', 'sectors.html', 'services.html', 'thank-you.html', 'will-drafting.html'];
  assert.deepEqual(readdirSync(dist).sort(), allowedRoot);
  assert.deepEqual(readdirSync(join(dist, 'assets')).sort(), ['favicon.png', 'serina-logo.png', 'site.js', 'styles.css', 'will-intake.js']);
  for (const name of ['README.md','package.json','netlify.toml','scripts','tests','.git','.github']) assert.ok(!existsSync(join(dist, name)), name);
  for (const page of ['index','about','services','sectors','contact','thank-you','will-drafting']) {
    assert.equal(publish(page + '.html'), read(page + '.html'), page);
  }
});

test('Netlify form backend contract is in the deployment, with no sensitive will submission', () => {
  const contact = publish('contact.html');
  const will = publish('will-drafting.html');
  assert.match(contact, /<form[^>]*data-netlify="true"[^>]*name="website-enquiry"/);
  assert.match(contact, /data-netlify-honeypot="bot-field"/);
  assert.match(contact, /name="form-name"[^>]*value="website-enquiry"/);
  assert.match(contact, /name="phone"[^>]*required/);
  assert.match(contact, /name="email"[^>]*type="email"/);
  assert.match(contact, /name="contact-consent"[^>]*required/);
  assert.doesNotMatch(will, /<form\b|<iframe\b|willintakeform\.netlify\.app/i);
  const sensitiveJS = publish('assets/will-intake.js');
  assert.doesNotMatch(sensitiveJS, /fetch\s*\(|XMLHttpRequest|sendBeacon\s*\(|localStorage\.|sessionStorage\.|\.submit\s*\(/);
  assert.match(will, /not transmitted/i);
});

test('CSP and sensitive-page cache controls are emitted consistently', () => {
  assert.equal(publish('_headers'), netlifyHeaderFile());
  const csp = securityHeaders['Content-Security-Policy'];
  assert.match(csp, /script-src 'self'/);
  assert.match(csp, /connect-src 'self'/);
  assert.match(csp, /form-action 'self'/);
  assert.match(csp, /frame-src 'none'/);
  assert.doesNotMatch(csp, /script-src[^;]*unsafe-inline/);
  assert.match(csp, /https:\/\/images\.unsplash\.com/);
  assert.match(willPageHeaders['Cache-Control'], /no-store/);
  assert.match(publish('_headers'), /X-Content-Type-Options: nosniff/);
  assert.match(publish('_headers'), /X-Frame-Options: DENY/);
});

test('preview release metadata cannot falsely claim a live backend is enabled', () => {
  const meta = JSON.parse(publish('release-info.json'));
  assert.equal(meta.stage, 'client-review');
  assert.equal(meta.willSubmission, 'disabled');
  assert.match(meta.enquiryProvider, /requires site-side form detection/);
  assert.match(publish('robots.txt'), /Disallow: \/\s*$/m);
});

// Sensitive in-memory fields must also be cleared when the browser navigates
// away, so back/forward restoration cannot reveal an old review summary.
test('will intake clears private fields and returns to Start when leaving', () => {
  const script = read('assets/will-intake.js');
  assert.match(script, /addEventListener\('pagehide'/);
  assert.match(script, /review\.replaceChildren\(\)/);
  assert.match(script, /showStep\(0, false\)/);
});
