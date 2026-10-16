/* Safe, read-only deployment probe. Does not send a customer enquiry.
   Usage: node scripts/smoke-live.mjs https://your-netlify-site.netlify.app [expected-commit-sha]
*/
import assert from 'node:assert/strict';
const [address, expectedSha] = process.argv.slice(2);
if (!address) {
  console.error('Usage: node scripts/smoke-live.mjs https://your-site.netlify.app [expected-sha]');
  process.exit(2);
}
const origin = new URL(address);
if (origin.protocol !== 'https:' || origin.username || origin.password || origin.search || origin.hash) {
  throw new Error('Supply the HTTPS site origin only, without credentials or URL parameters');
}
const url = path => new URL(path, origin);
async function probe(path) {
  const response = await fetch(url(path), { redirect: 'follow', signal: AbortSignal.timeout(12000) });
  assert.equal(response.status, 200, `${path}: unexpected HTTP ${response.status}`);
  assert.equal(new URL(response.url).origin, origin.origin, `${path}: unexpected redirect to another site`);
  return { response, body: await response.text() };
}
const routes = ['/index.html','/services.html','/about.html','/sectors.html','/contact.html','/will-drafting.html','/thank-you.html','/assets/site.js','/assets/will-intake.js','/assets/styles.css','/release-info.json'];
for (const route of routes) {
  const { response, body } = await probe(route);
  if (route.endsWith('.html')) assert.match(body, /Serina Bhasera Consultancy/, `${route}: unexpected site content`);
  if (route === '/contact.html') {
    assert.match(body, /name="website-enquiry"/);
    assert.match(body, /name="form-name"/);
  }
  if (route === '/will-drafting.html') {
    assert.match(body, /id="will-questionnaire"/);
    assert.doesNotMatch(body, /<iframe\b|willintakeform\.netlify\.app/);
    assert.match(response.headers.get('cache-control') || '', /no-store/i);
  }
  if (route.endsWith('.html')) {
    const policy = response.headers.get('content-security-policy') || '';
    assert.match(policy, /frame-ancestors 'none'/);
    assert.match(policy, /form-action 'self'/);
  }
  if (route === '/release-info.json') {
    const info = JSON.parse(body);
    assert.equal(info.willSubmission, 'disabled');
    if (expectedSha) assert.equal(info.revision, expectedSha, 'Unexpected deployed commit');
    console.log('Deployed source:', info.revision);
  }
  console.log('OK', route);
}
console.log('Read-only deployment smoke PASS. This does NOT prove that Netlify Forms receives submissions.');
console.log('To complete that gate, use a harmless submission and verify its readback in the Netlify Forms dashboard.');
