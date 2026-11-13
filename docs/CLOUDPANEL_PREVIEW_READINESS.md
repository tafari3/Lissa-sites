# Serina Bhasera Consultancy — ZCHPC CloudPanel preview readiness

## Scope
Source: `tafari3/Lissa-sites` branch `main`. Bind each deployment to its exact Git commit SHA (do not reuse an earlier staging revision).
Deployment domain: `nyandagreatmindsconsultancy.co.zw` (owner has described Nyanda and Serina as the same company; confirm public-facing brand).

## Build

Run `COMMIT_REF="$(git rev-parse HEAD)" npm run build:cloudpanel` from a clean repository checkout, or supply the verified 40-character commit SHA explicitly and deploy **only the contents of** `dist-cloudpanel/`.
Do not deploy source, `.git`, scripts, tests, private documents, or credential files.
This is a **staging preview**, not a completed production deployment.

The CloudPanel preview deliberately **does not receive online enquiries**. The previous `website-enquiry` was Netlify-hosted. The preview replaces it with direct WhatsApp and telephone contacts and removes the Netlify-only thank-you page. This is preferable to a broken form or fake submission success. The will questionnaire remains browser-only and must not be connected to SMTP or a general enquiry endpoint.

## Recommended CloudPanel site type

Create a **Generic PHP Site** for this exact tenant/domain, with a dedicated site user. Static HTML works inside a PHP site, and the same vhost can later serve a reviewed PHP enquiry endpoint. PHP is a *future hosting capability* here, not an existing deployed backend. Do not set up an unnecessary Node.js app or database.

## Before making changes to ZCHPC

1. Resolve the exact CloudPanel host, site-user and root path; inventory existing vhost(s) for both apex/www and ports 80/443; verify no other tenant has the hostname bound.
2. Read the current authoritative nameservers and DNS records (A/AAAA/CNAME/MX/TXT). Capture the old values. Set the website A/AAAA records only after confirming correct public edge/NAT. Do not change MX/SPF/DKIM/DMARC while configuring the website.
3. Create only this site's vhost and document root. Keep the previous known-good release or an equivalent rollback path. Upload only the allowlisted public artifact, as the site user.
4. Confirm the site's Nginx security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, CSP, `Permissions-Policy`) are applied by the real vhost. Netlify `_headers` is **not** read by Nginx. Set `Cache-Control: no-store` for `/will-drafting.html` to avoid caching sensitive worksheet markup. Confirm generated content includes no user answers.
5. Issue and test HTTPS certificate for apex and www (if www configured); check redirect, certificate renewal path, real public routing, 404 and an existing neighboring tenant host.
6. Check homepage, About Us portrait, Services, Sectors, Contact, Will Drafting, footer links, photos/fallbacks, mobile menu, WhatsApp links, privacy of the will worksheet and the release-info revision from an external browser.
7. Keep `robots.txt` and `noindex` until the client approves details, imagery rights, legal copy, service claims and launch.

## After the client configures emails

Build a **separate server-side general enquiry endpoint** under this exact PHP site's ownership, using authenticated TLS SMTP and credentials kept *outside* the document root (or injected securely at runtime). Validate and limit input server-side, check origin/CSRF, add honeypot and rate limiting, ensure no secrets in logs, minimize retention, fail closed on mail outages, and test actual receipt/readback and retry behavior. The PHP endpoint must never accept the Will Drafting questionnaire's confidential details. Keep phone required and email optional.

Only after these tests should the frontend submit to that endpoint and display a real success response. Do not use PHP `mail()` or show a thank-you page without proof of delivery.

## Current external gates

- CloudPanel host identity, SSH/site-user access and routing cannot yet be verified.
- Website domain DNS to the ZCHPC web endpoint and TLS are unproven.
- General enquiry SMTP configuration and backend do not exist yet.
- Business contact details, legal/privacy approval, brand/domain mismatch and third-party image licensing remain to be confirmed.

**Verdict: suitable for CloudPanel preview preparation only; NOT READY for full production enquiries.**
