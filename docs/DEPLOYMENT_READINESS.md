# Serina Bhasera Consultancy — Deployment readiness

## Scope and truth of the current product

- **Marketing pages:** Home, About, Services, Sectors, Contact. Photographic design maintained.
- **General enquiries:** Real static `website-enquiry` form, handled by **Netlify Forms** only on a site that has form detection enabled and was redeployed after activation. Phone is required, email optional. Netlify's site dashboard is the staff-side submissions inbox; there is no custom database or CRM. Notifications require setup in Netlify's Forms settings.
- **Will preparation:** Eight-step browser-only preparation worksheet. Users can review and print their answers. The website does **not** transmit or store confidential family, beneficiary, bequest or financial information. This is deliberate until a private backend and legal/data-processing arrangements are approved. It is **not** a legally binding will.
- **Preview status:** Pages are intentionally marked `noindex`, and `robots.txt` blocks crawlers. Do not remove these protections until the client approves full public release.

## Git-connected Netlify deployment

1. Select the correct existing Netlify site and link its deploy branch to `tafari3/Lissa-sites` `main`. `netlify.toml` provides build command `npm run build` and publish folder `dist/`; do not publish repository root.
2. In Netlify **Forms**, enable **form detection**. Deploy **after** form detection is on, since Netlify processes the static HTML at deploy time.
3. Verify the deployed `/release-info.json` revision matches the exact GitHub SHA; use `node scripts/smoke-live.mjs https://YOUR-SITE.netlify.app EXPECTED_SHA` for a read-only check.
4. Submit one **harmless synthetic general enquiry** on the Netlify website. Verify it appears in the `website-enquiry` Netlify Forms submissions inbox, including the phone, service and message; do not include real customer details.
5. Configure a notification for `website-enquiry` to the client-approved recipient, confirm actual delivery, and restrict submission access to authorised consultancy users.
6. Check TLS, domain redirect, layout on desktop/mobile, WhatsApp numbers/links, and error/retry behaviour. Capture a passing release record with the deployed revision and the harmless test-submission reference.
7. Keep staged indexing restrictions and preview wording until the client has approved business contact details, photographs and privacy/legal text; then update source and repeat acceptance on the new exact release.

## Manual ZIP deployment

Run `npm run build`, then ZIP **the contents of `dist/`**, not the repository root. Include the generated `_headers`, `release-info.json`, HTML pages and assets. Manually uploading a ZIP does not itself prove Netlify Forms was detected or that notifications work; repeat the live submission/readback tests above.

## Conditions that remain external or owner-reserved

- Verify the email addresses, WhatsApp numbers and Harare/Masvingo office addresses imported from the client's ZIP. Confirm the email that should receive general enquiry notifications.
- Obtain the client's professional/legal approval for the will questionnaire, its scope, the wording of the advisory disclaimer and consent expectations.
- Agree whether sensitive will answers should ever be submitted online. If yes, commission a **separate authenticated, access-controlled and encrypted** intake backend with server-side input validation, anti-abuse controls, restricted staff access, audit trail, retention/deletion policy, incident response and a verified secure storage/data-hosting arrangement. Do **not** connect the will worksheet to Netlify Forms or email the details by default.
- Confirm privacy notice (controller/contact, purposes, basis, processors, security, retention, deletion/request handling), image rights and professional regulatory claims before full public launch.
- Replace temporary third-party photo URLs with approved, locally hosted photographs before production when possible. Existing branded fallbacks must still render if the image CDN is unavailable.

## Troubleshooting and rollback

- If the website works locally but not on Netlify: check the deployed SHA at `/release-info.json` and compare it with GitHub `main`. Confirm `publish=dist`, the site build logs and form detection setting.
- If enquiries do not arrive: check Netlify Forms form detection, the deploy log's form processing, Netlify Forms inbox (including spam), and the recipient notification configuration. Do not show a fake success state in a local preview.
- If a deployment is bad, restore the most recent **verified good Netlify deploy** in the Netlify UI while retaining the failed build logs. Do not force-push or overwrite GitHub source to imitate a rollback.
- If the original local `4173` server is already running, use `PORT=4174 npm run dev` to run a separate preview.

## Acceptance state

**Pre-deployment prepared** means code builds with only approved public files and deterministic tests pass. **Customer-ready** requires actual Netlify-hosted behaviour and form-delivery evidence plus verified external details. Do not confuse the two.
