# Serina Bhasera Consultancy - ZCHPC CloudPanel production runbook

**Status:** source-level production candidate; not deployed, not customer-certified. Source: `tafari3/Lissa-sites`, exact SHA required at build time.

**Host:** not yet identified/verified. **Domain:** `nyandagreatmindsconsultancy.co.zw`. Public-facing website currently says **Serina Bhasera Consultancy**. Confirm the legal/trading-name relationship before enabling indexing. Never infer the target server from unrelated ZCHPC customer infrastructure.

## Product boundaries

- The normal pages are static HTML, CSS, JS, with approved profile photo. No Node server or database runs in production.
- The **general enquiry** is a dedicated PHP handler sending an authenticated TLS SMTP message to a fixed consultancy mailbox. Name/phone/message required, email optional. The PHP handler has server-side validation, honeypot, session CSRF, origin binding, rate limiting and generic error responses. It stores no enquiry contents by default.
- The **Will & Testament** worksheet is strictly browser-only; it never posts family, beneficiary, asset or bequest answers. Users can print locally, but it is not a legal will. The client's legal/privacy approval of all proposed questions is still pending.
- Existing `npm run build:cloudpanel` provides a **safe preview** with online enquiries explicitly disabled. `npm run build:cloudpanel:production` produces a distinct candidate with `public/` and `private/`; never confuse the two.

## 1. Read-only target discovery before ZCHPC mutation

1. Identify the exact CloudPanel URL, VM/server, tenant, dedicated site user, CloudPanel site type and document root. Inspect any existing vhost for apex/www plus shared Nginx listeners 80/443, site names and certificate ownership. Capture current config/rollback before changes. Do not alter another hosted site's virtual host.
2. Identify the domain's **authoritative nameservers**, A/AAAA, www, CAA, and existing mail MX/TXT records. Back up the old values before any DNS change. Do not touch MX/SPF/DKIM/DMARC when pointing the website.
3. Verify the public edge/NAT maps to the specific ZCHPC CloudPanel host and that DNS delegation matches the entity in control of the new domain.
4. Confirm sufficient disk space, PHP-FPM capabilities, site-user permissions and an operational rollback release. This should be done as read-only inspection first.

## 2. CloudPanel site

- Create a dedicated **Generic PHP Site** with PHP **8.2+** for `nyandagreatmindsconsultancy.co.zw`, adding `www` only if supported by DNS/certificate and set up a canonical redirect. Confirm Nginx processes PHP; never rely on a generic static site to execute `.php`.
- Use a site-specific PHP-FPM environment/configuration and permissions, not a shared/global PHP pool secret. Only the site's service user should read application credentials.
- Check for reserved/conflicting vhosts and use the existing CloudPanel Nginx routing model; do not bind 80/443 on a separate process.

## 3. Build from a verified checkout

```
COMMIT_REF=<FULL_GITHUB_MAIN_SHA> npm run check:cloudpanel
COMMIT_REF=<FULL_GITHUB_MAIN_SHA> npm run check:cloudpanel:production
```

Only the **contents of `dist-cloudpanel-production/public/`** belong in the verified CloudPanel site's web root. Put the contents of `dist-cloudpanel-production/private/` in a **separate directory outside every served document root**. Do not upload the ZIP itself to public root. Keep an older verified release for rollback. Never put `.git`, source templates, tests, `.env`, credentials, Composer vendor directories or private session/rate files in webroot.

In the private app directory (site user):

```
composer install --no-dev --prefer-dist --optimize-autoloader
```

This installs the maintained `phpmailer/phpmailer` dependency. A real server needs the `php`, `openssl`, `session` and typical Composer prerequisites. Create **`sessions/` and `rate-limits/`** under the private app directory with site-user-only permissions `0700`. Do not copy test fakes used by the repository's HTTP integration tests.

## 4. Private PHP-FPM configuration

Supply **only to this site's PHP-FPM runtime** through an approved secret/configuration mechanism (not in Git, public files, command history or chat):

| Key | Expected value |
|---|---|
| `SERINA_PRIVATE_DIR` | Absolute private application path, outside webroot |
| `SERINA_ORIGIN` | `https://nyandagreatmindsconsultancy.co.zw` (exact; redirect www to apex) |
| `SERINA_RATE_SECRET` | High-entropy secret, at least 32 characters |
| `SERINA_SMTP_HOST` | Verified ZCHPC/authorized SMTP submission host |
| `SERINA_SMTP_PORT` | 465 (implicit TLS) or 587 (STARTTLS) |
| `SERINA_SMTP_USER`, `SERINA_SMTP_PASS` | Site-only SMTP account/credential |
| `SERINA_MAIL_TO`, `SERINA_MAIL_FROM` | Authorized inbox/sender addresses |
| `SERINA_MAIL_READY` | **0** during setup; **1** only during a protected live delivery test and public service |

Ensure PHP-FPM actually receives the variables. Avoid enabling `phpinfo()` publicly or exposing secrets in logs/errors. Do not disable SMTP certificate verification. Use separate tenant credentials; do not share privileged Mailcow administrator passwords with the site.

The endpoints are `/api/csrf.php` and `/api/contact.php`; with missing configuration they fail with HTTP **503**, not fake success. The site must not be exposed with the active form before the receiving mailbox and SMTP are operational.

## 5. Nginx/TLS/security checks

- Confirm PHP requests are executed, **not downloaded as plaintext**; test with secret-free PHP endpoints prior to exposing the site.
- Apply equivalent security headers in the actual CloudPanel Nginx vhost (not via Netlify `_headers`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, `Permissions-Policy`, restrictive CSP allowing self scripts and images from `images.unsplash.com` until licensed photos are local, and `form-action 'self'`.
- On `/will-drafting.html` set `Cache-Control: no-store`; on all PHP form endpoints set `Cache-Control: no-store`; prohibit serving dotfiles, private config, backup files, logs and Composer directories.
- Set a small request body cap for `/api/` (e.g. 8 KiB) and ensure sessions/rate directory are not publicly reachable.
- Verify trusted TLS certificate for apex and www if www is enabled, HTTP-to-HTTPS redirect, SNI served cert and automatic renewal. Leave domain email DNS alone.

## 6. Prove the natural end-to-end release

Use only **synthetic test enquiries**. Check the public homepage and every page, assets, menus, Nevanji photo, WhatsApp, phone links, form errors, mobile widths, print worksheet, 404 behaviour and redirects. Fetch `/release-info.json` and match the exact deployed SHA. Test negative endpoint paths: direct GET to POST route, missing/expired/replayed CSRF, wrong Origin, spam honeypot, malformed phone, high request volume, SMTP outage and retry behaviour.

With PHP Mailer installed and the SMTP account confirmed, enable mail for a bounded staging/live test (`SERINA_MAIL_READY=1`) **before announcing the public site**. Submit a synthetic phone-only enquiry through the real HTTPS domain. **Read it back from the actual recipient mailbox**, including correct phone/service/message, not just a browser success message or SMTP 250. Then test a valid optional email and an SMTP refusal. Check logs have no secrets or personal messages and the sender/reply-to identities are correct. Only then announce online enquiries as operational.

## 7. Customer, privacy and operations gates

- Verify contact numbers/office addresses/recipients with the business. Confirm the Nyanda domain/Serina public name relationship.
- Approve will questionnaire's legal wording, consent and privacy policy before marketing it as a legal service. It is *not* a signed will and stores no will instructions server-side.
- Obtain rights to the illustrative third-party photography; replace temporary externally hosted photos with approved local images as appropriate.
- `robots.txt` and meta `noindex` intentionally still prevent indexing. Remove those restrictions only after the client authorizes public search visibility and confirms claims/privacy.
- Verify rollback to a known-good release, web certificate renewal, log/health monitoring, backups/recovery for source and private config (without leaking secrets), and correct shared-server isolation.
- Any change after acceptance needs a new exact SHA and relevant re-validation.

## Current verdict

**SOURCE_LEVEL_CANDIDATE_ONLY.** SMTP provider/recipient, CloudPanel host/vhost, DNS, HTTPS, privacy/legal approvals, runtime configuration and real inbox receipt remain unverified. Do not claim full production readiness from local tests or fake SMTP. If the host is not yet ready, keep the safer preview build instead.
