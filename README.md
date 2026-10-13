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
- `contact.html` — direct email enquiry and office cities
- `assets/styles.css` — global design and responsive layouts
- `assets/site.js` — mobile navigation, keyboard/escape handling, copyright year
- `assets/serina-logo.png` — client-brochure logo crop; replace when an official master file arrives
- `scripts/build-pages.py` — templates and site copy; rerun after content changes

## Brand & visual direction

A bolder editorial corporate direction: midnight navy, vivid heritage gold and warm white, with high-contrast headings, border-led service lists and carefully paced light/dark sections. Photo areas have designed text/architectural-grid fallbacks if third-party images fail to load.

Temporary architecture/interior stock photography is used as **illustration only**, never as evidence of projects completed by the firm. Replace with approved client images later. Current illustrative image endpoints:

- https://images.unsplash.com/photo-1486406146926-c627a92ad1ab
- https://images.unsplash.com/photo-1497366754035-f200968a6e72

The site layout still works on fallback colours if remote images do not load. In final production, host approved images locally for dependable performance.

## Before client launch

- Replace temporary photos with approved client-owned or licensed project/context photos.
- Replace cropped logo with official original if provided.
- Verify info@serinabhasera.co.zw actually receives mail; it's from client brochure.
- Verify professional/regulatory claims and final service scopes (including auditing and valuation).
- Confirm client office addresses, phone numbers, and any WhatsApp/business channels before showing them. The brochure appears to contain sample contact values, so they are intentionally not published.
- Remove staging-only `noindex` meta and `robots.txt` block only after client approval.
- Confirm domain/hosting and final enquiry delivery. There is **no fake contact form**; `mailto:` opens a real email client.

**Security**: This is a public repository. Never commit credentials, private client documents, or sensitive client information.
