# Serina Bhasera Consultancy website

Professional brochure-led corporate site, in development.

## Run locally

Node.js 20+ is recommended. From the repository root:

```sh
npm run dev
```

Open http://localhost:4173. There are no external package dependencies. `npm test` runs the content/navigation checks.

## Pages

- `index.html` — home, services overview, company overview, sectors, enquiry CTA
- `about.html` — the firm and multidisciplinary approach
- `services.html` — six brochure practice areas and related advisory
- `sectors.html` — six sectors served
- `contact.html` — Netlify Forms-based enquiries: name, phone/WhatsApp, optional email, subject, short message, consent
- `thank-you.html` — confirmation page after Netlify processes a submission
- `assets/styles.css` — global design and responsive layouts
- `assets/site.js` — mobile navigation, keyboard/escape handling, copyright year
- `assets/serina-logo.png` — client-brochure logo crop; replace when an official master file arrives
- `scripts/build-pages.py` — templates and site copy; rerun after content changes

## Brand & visual direction

Editorial corporate design using the client's navy-and-gold identity. The hero is a concise introduction with three linked advisory pathways; dedicated estate/will-preparation enquiries are surfaced on the homepage and Services. No remote stock images, simulated case studies, fabricated results or misleading testimonials are displayed. The layout remains complete with local brand assets only.

### Design contract

- High-contrast midnight navy, gold and restrained warm ivory. Colour emphasises actions, not decoration.
- Serif headlines with readable sans-serif copy; no gratuitous card grids, gradients or glass effects.
- The homepage leads visitors to either services or a short, phone-first contact enquiry.
- Estate and will-preparation enquiries collect only contact information and a short initial description, never intimate family or asset details.
- All important links, including homepage CTAs, lead to site pages, not email software.
- Mobile header/nav, interactive form select prefill and keyboard controls remain accessible.
- Test before any client-facing release. Netlify form detection and recipient notifications require configuration in the actual Netlify account; passing source tests does not establish live delivery.

## Before client launch

- Add contextual photography only if suitable client-approved images are supplied; no photos are necessary for the current design.
- Replace cropped logo with official original if provided.
- Verify info@serinabhasera.co.zw actually receives mail; it's from client brochure.
- Verify professional/regulatory claims and final service scopes (including auditing and valuation).
- Confirm client office addresses, phone numbers, and any WhatsApp/business channels before showing them. The brochure appears to contain sample contact values, so they are intentionally not published.
- Remove staging-only `noindex` meta and `robots.txt` block only after client approval.
- Netlify preview is already used by the project; confirm whether it auto-deploys from GitHub or was manually published.
- Enable **Forms > Form detection** in the Netlify dashboard, then redeploy the site including `contact.html`. Enquiries appear under Netlify Forms; configure optional email notifications after the client confirms the destination address.
- Check an actual test submission in the Netlify dashboard **before** treating the form as live. A successful local build or GitHub Actions run does not prove delivery.
- Keep will-related enquiries to contact details only. Do not ask for beneficiaries, ID numbers, financial information, or private will instructions in this form. Approve legal/professional copy and privacy handling before final launch.
- The local and GitHub Pages previews do not accept submissions (they display an explanatory message instead); the Netlify deployment must be configured first.

**Security**: This is a public repository. Never commit credentials, private client documents, or sensitive client information.
