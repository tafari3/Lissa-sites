# Serina Bhasera Consultancy website

Brochure-led professional static website with a photograph-led navy-and-gold design.

## Overview

The October 2026 ZIP was reconciled against GitHub `main` rather than copied over it.
It was based on the older `0858000` revision. New contact methods and a WhatsApp
widget were integrated; the latest phone-first Netlify enquiry form and estate/will
CTA were preserved. The ZIP's email-required form, mailto-only submission and
fake success confirmation were deliberately not imported.

## Run locally

Node.js 20+ required. Run `npm run dev` and open http://localhost:4173.
Run `npm test` for content, accessibility and form-contract checks.
`python scripts/build-pages.py` regenerates the 7 HTML pages from shared templates.

## Hosting and forms

The form on `contact.html` is a **real Netlify-compatible HTML form** (`website-enquiry`).
The visitor supplies a name, phone or WhatsApp number and short message.
Email is optional. The estate will-preparation link preselects its service.
The form uses Netlify Forms on the deployed Netlify site, and shows a reminder
instead of claiming success when run on a local or GitHub Pages preview.

**Netlify operational setup required:** Enable Forms/form detection if not already
configured, redeploy this version, configure appropriate team-only notifications,
and conduct a real non-sensitive test submission. Submission delivery on the existing
Netlify deployment has **not** yet been verified.

## Uploaded updates and unverified business details

The uploaded ZIP introduced contact information for:
- nevanj@serinabhasera.co.zw and victor@serinabhasera.co.zw
- WhatsApp direct lines +263 77 622 4970 and +263 78 229 5158
- 151 Kwame Nkrumah Ave, Harare; Stand No. 965 Nemamwa, Masvingo

These are **user-uploaded edits, not independently verified contact details**.
Confirm their ownership/correctness with the consultancy before final launch,
and confirm which mailbox should receive Netlify notifications. No credentials
or customer submissions belong in this public repository.

Temporary Unsplash photo URLs illustrate the built environment; they are not
represented as client projects. Obtain approved licensed/company imagery for launch.
Remove staging `noindex`/`robots.txt` exclusions only after the client authorises
indexing and the contact, privacy and legal review is complete.

## Dedicated Will & Testament questionnaire

`will-drafting.html` is linked from **Services -> Estate Planning & Property Advisory**. It preserves the requested photo-based navy-and-gold brand and displays the client's **actual external questionnaire** from `https://willintakeform.netlify.app/` after the visitor selects **Start the questionnaire**. An explicit **Open original form** link is always available, including when the outside service disallows embedding with `frame-ancestors` or `X-Frame-Options`.

The eight stage names and start question are grounded in the client screenshot. The complete set of underlying form questions was **not** available to inspect, and has **not** been invented or copied into this repository. The will questionnaire is not implemented with Netlify Forms on this site. Submissions, identity information, family details and asset information remain with the **original external provider**, outside the consultancy's public GitHub site and general enquiry inbox. No external will form is loaded automatically before the visitor opts in.

Before treating this as a fully commissioned client intake flow, confirm **ownership/authorization, data controller and recipient, secure storage and access restrictions, consent/privacy notice, retention/deletion policy and the applicable legal review** for the existing will-intake service. Verify that the original service actually loads when framed in the production Netlify deployment; if it does not, visitors can open it in a separate tab. Do not claim the form has been successfully submitted merely because the iframe loaded. No completed will is generated or legally executed by this landing page.
