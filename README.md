# Serina Bhasera Consultancy — website

A responsive, static-first brochure website for Serina Bhasera Consultancy, developed from the client-supplied brochure and follow-up service list.

## Preview locally

Requirements: Node.js 20+.

```sh
npm run dev
```

Then open `http://localhost:4173`. No packages need to be installed.

Run the basic checks with `npm test`.

## Content and images

- `index.html` — website copy, headings, service listings, sectors and links.
- `assets/styles.css` — colours, typography, spacing, layout and mobile responsiveness.
- `assets/site.js` — mobile navigation and current-year footer.
- `assets/architectural-study.svg` — illustrative hero art; replace later with an approved photo by updating the `src` and `alt` text in `index.html`.
- `assets/planning-lines.svg` — illustrative supporting art; similarly replaceable.
- `assets/serina-wordmark.svg` — clean vector interpretation of the brochure logo for preview; replace with the official master logo when available.

The website deliberately uses **illustrative architectural artwork**, not invented photographs of the client's work. Future approved project photography can replace these assets.

## Required verification before production

1. Confirm the scope of **auditing** and **asset valuation** before adding detailed service descriptions. Both are labelled with `*` in this draft.
2. Confirm that “Spartial planning” in the client's message means **spatial planning**.
3. Confirm the email `info@serinabhasera.co.zw` is active and correct. The brochure supplies that email; it has not been externally verified.
4. Get approved company photos/project examples and the original high-resolution/vector logo when possible.
5. The phone numbers and Harare street address in the brochure look provisional; they are intentionally **not** published.
6. Get client sign-off on public copy and professional/regulatory claims (e.g. EMA accreditation) before final launch.
7. Decide and configure production hosting, domain, HTTPS and enquiry delivery. This draft uses a normal `mailto:` email action and **does not pretend to have a working server-side contact form**.

## Hosting

This project is plain HTML/CSS/JS, so it can be deployed to almost any static host, including GitHub Pages, Cloudflare Pages, Netlify or a standard web server. It does not need a backend or database in its current form.

Never commit client credentials or private project documents to this **public** repository.
