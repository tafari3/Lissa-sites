# Content and design change handoff for Serina Bhasera Consultancy

The client may provide adjustments while the staging site is being prepared.
Capture only the required content: page/section, replacement words or new service details, approved photos and their rights/attribution, updated contact channels, preferred enquiry inbox and ownership, and any legal/professional review of the Will Drafting wording.

For every change:
- Preserve the existing photo-led navy/gold direction unless the client explicitly changes it.
- Edit the canonical generator `scripts/build-pages.py` or `scripts/will-page.html`, not only generated HTML.
- Run `python3 scripts/build-pages.py`, `npm run check`, browser spot checks, and verify the relevant Netlify live path after deployment.
- Do not add fake testimonials, credentials, project outcomes or legally binding drafting claims.
- Do not place sensitive sample client/will information or credentials in the public repository.
- If a new will question changes what sensitive information is collected, re-evaluate the confidentiality and data-processing boundary before enabling any submission.
