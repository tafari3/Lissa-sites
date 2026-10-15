from pathlib import Path
R=Path(__file__).resolve().parent.parent
nav=[('index.html','Home'),('about.html','About the firm'),('services.html','Services'),('sectors.html','Who we serve'),('contact.html','Contact')]

def header(active):
 return f'''<div class="topline"><div class="container topline-inner"><span>HARARE &amp; MASVINGO <span class="topline-dot">·</span> ZIMBABWE</span><span>Strategic Advice. Practical Solutions. Sustainable Results.</span></div></div>
<header class="site-header" id="top">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="Serina Bhasera Consultancy — home"><img src="assets/serina-logo.png" alt="Serina Bhasera Consultancy" width="695" height="168"></a>
    <button type="button" class="menu-toggle" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
    <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
      {''.join(f'<a href="{url}"'+(' aria-current="page"' if active==url else '')+f'>{label}</a>' for url,label in nav)}
      <a class="nav-enquiry" href="contact.html#enquiry">Enquire <span aria-hidden="true">↗</span></a>
    </nav>
  </div>
</header>'''

def footer():
 return '''<footer class="footer" id="footer"><div class="container footer-upper"><div class="footer-identity"><p class="footer-name">Serina Bhasera<br><span>Consultancy</span></p><p>Strategic Advice.<br>Practical Solutions.<br>Sustainable Results.</p></div><div class="footer-col"><h2>Explore</h2><a href="index.html">Home</a><a href="about.html">About us</a><a href="services.html">Our services</a><a href="sectors.html">Who we serve</a></div><div class="footer-col"><h2>Contact</h2><a href="mailto:info@serinabhasera.co.zw">info@serinabhasera.co.zw</a><p>Harare &amp; Masvingo<br>Zimbabwe</p><a href="contact.html#enquiry">Send an enquiry <span aria-hidden="true">↗</span></a></div></div><div class="container footer-lower"><span>© <span data-year>2026</span> Serina Bhasera Consultancy</span><span>Website preview · Content subject to client approval</span><a href="#top">Back to top ↑</a></div></footer>'''

def page(title,desc,active,body):
 return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b1f3a">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title} | Serina Bhasera Consultancy">
<meta property="og:description" content="{desc}">
<title>{title} | Serina Bhasera Consultancy</title>
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="stylesheet" href="assets/styles.css">
<script src="assets/site.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
{header(active)}
<main id="main">
{body}
</main>
{footer()}
</body></html>
'''

def page_intro(kicker,heading,paragraph):
 return f'''<section class="page-intro"><div class="container page-intro-inner"><div><p class="kicker">{kicker}</p><h1>{heading}</h1></div><p class="page-intro-copy">{paragraph}</p></div></section>'''

# Home — editorial, purpose-led, fully usable without remote images.
home='''<section class="hero hero-editorial" aria-labelledby="hero-title"><div class="hero-inner"><div class="hero-copy"><div class="hero-copy-inner"><p class="kicker">LAND. BUSINESS. LEGACY.</p><h1 id="hero-title">Clear advice for <em>what comes next.</em></h1><p>Land development, environmental compliance, property matters and organisational strategy. Practical guidance for individuals and organisations across Zimbabwe.</p><div class="hero-actions"><a class="button button-primary" href="contact.html#enquiry">Discuss your enquiry <span aria-hidden="true">↗</span></a><a class="text-link" href="services.html">Explore our services <span aria-hidden="true">→</span></a></div><p class="hero-footnote">SERINA BHASERA CONSULTANCY <span aria-hidden="true">/</span> ZIMBABWE</p></div></div>
<div class="hero-pathways" aria-label="Choose an area of advice"><div class="hero-pathways-header"><span>FIND THE RIGHT ADVICE</span><span>01 — 03</span></div>
<a class="hero-pathway" href="services.html#land-planning"><span class="pathway-number">01</span><span class="pathway-content"><strong>Land &amp; development</strong><small>Spatial planning, approvals &amp; environmental matters</small></span><span class="pathway-arrow" aria-hidden="true">↗</span></a>
<a class="hero-pathway" href="services.html#governance"><span class="pathway-number">02</span><span class="pathway-content"><strong>Business &amp; governance</strong><small>Strategy review, compliance &amp; board advisory</small></span><span class="pathway-arrow" aria-hidden="true">↗</span></a>
<a class="hero-pathway" href="services.html#estate"><span class="pathway-number">03</span><span class="pathway-content"><strong>Estate &amp; property</strong><small>Succession planning, wills &amp; property advice</small></span><span class="pathway-arrow" aria-hidden="true">↗</span></a>
<div class="hero-pathways-foot"><span class="hero-pathways-rule" aria-hidden="true"></span><span>Thoughtful advice begins with the right conversation.</span></div></div></div></section>
<section class="section services-overview" aria-labelledby="services-title"><div class="container"><div class="section-lead"><div><p class="kicker">WHAT WE DO</p><h2 id="services-title">Experience across connected disciplines.</h2></div><div class="section-lead-aside"><p>Development, property and business decisions rarely stand alone. Explore the consultancy's areas of advice and find the right starting point for your needs.</p><a class="text-link text-link-dark" href="services.html">View all services <span aria-hidden="true">↗</span></a></div></div>
<div class="services-list">
<a class="service-tile" href="services.html#land-planning"><span class="service-num">01 / PLANNING</span><h3>Land Use &amp;<br>Development Planning</h3><p>Spatial plans, subdivisions, change-of-use applications and permits.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#environment"><span class="service-num">02 / ENVIRONMENT</span><h3>Environmental<br>Consulting &amp; EIA</h3><p>Environmental assessments, regulatory liaison and compliance.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#sustainability"><span class="service-num">03 / SUSTAINABILITY</span><h3>ESG, Climate &amp;<br>Sustainability</h3><p>Climate risk assessment, sustainability strategy and reporting.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#technical"><span class="service-num">04 / INFRASTRUCTURE</span><h3>Technical Design &amp;<br>Infrastructure</h3><p>Site layouts, specialist coordination and infrastructure planning.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#estate"><span class="service-num">05 / PROPERTY</span><h3>Estate &amp; Property<br>Advisory</h3><p>Succession, asset valuation and property portfolio guidance.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#governance"><span class="service-num">06 / GOVERNANCE</span><h3>Governance, Legal<br>&amp; Strategy</h3><p>Governance frameworks, board induction and strategic review.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
</div></div></section>
<section class="about-feature"><div class="container about-feature-inner"><div><p class="kicker kicker-inverse">OUR APPROACH</p><h2>Different disciplines. One considered approach.</h2></div><div class="about-feature-copy"><p>Serina Bhasera Consultancy works across land planning, environmental compliance, technical design and organisational strategy.</p><p>Our focus is on understanding each client's context and helping identify the practical considerations behind their next decision.</p><a class="light-link" href="about.html">Discover the firm <span aria-hidden="true">↗</span></a></div></div></section>
<section class="estate-spotlight" aria-labelledby="estate-title"><div class="container estate-spotlight-inner"><div class="estate-message"><p class="kicker">ESTATE &amp; SUCCESSION PLANNING</p><h2 id="estate-title">Take care of what matters. <em>Plan ahead.</em></h2><p>Thinking about preparing a will or organising your estate? Begin with a simple enquiry. We can discuss your needs before any detailed personal information is shared.</p><a class="button button-primary" href="contact.html?service=will-preparation#enquiry">Ask about preparing a will <span aria-hidden="true">↗</span></a></div>
<div class="estate-next"><p class="estate-label">HOW TO BEGIN</p><ol><li><span>01</span><strong>Tell us how to reach you.</strong><small>Just your name and phone number.</small></li><li><span>02</span><strong>Briefly describe your enquiry.</strong><small>No sensitive documents or family details.</small></li><li><span>03</span><strong>Discuss the next steps.</strong><small>The team can follow up with you directly.</small></li></ol></div></div></section>
<section class="section sector-section" aria-labelledby="sector-title"><div class="container sector-layout"><div class="sector-copy"><p class="kicker">WHO WE SERVE</p><h2 id="sector-title">A broad range of needs. A personal starting point.</h2><p>Supporting individuals, developers, businesses and institutions whose decisions shape Zimbabwe's communities and economy.</p><div class="sector-rows"><a href="sectors.html#fuel">Fuel station developers <span aria-hidden="true">↗</span></a><a href="sectors.html#commercial">Commercial &amp; industrial developers <span aria-hidden="true">↗</span></a><a href="sectors.html#residential">Residential estate developers <span aria-hidden="true">↗</span></a><a href="sectors.html#landowners">Landowners &amp; families <span aria-hidden="true">↗</span></a><a href="sectors.html#mining">Mining &amp; energy <span aria-hidden="true">↗</span></a><a href="sectors.html#public">NGOs &amp; public-sector organisations <span aria-hidden="true">↗</span></a></div></div>
<aside class="sector-insight" aria-labelledby="sector-insight-title"><div class="sector-insight-inner"><p class="sector-insight-top">START THE CONVERSATION <span>01 / 03</span></p><h3 id="sector-insight-title">Not sure where to begin?</h3><p>Tell us what you are planning or which requirement you need help with. A short enquiry is enough to start.</p><div class="sector-insight-options"><a href="contact.html?service=land-planning#enquiry"><span>Planning a development</span><span aria-hidden="true">↗</span></a><a href="contact.html?service=governance#enquiry"><span>Advising an organisation</span><span aria-hidden="true">↗</span></a><a href="contact.html?service=estate#enquiry"><span>Managing property or an estate</span><span aria-hidden="true">↗</span></a></div><p class="sector-insight-bottom">NO EMAIL ADDRESS NEEDED</p></div></aside></div></section>
<section class="callout"><div class="container callout-inner"><div><p class="kicker kicker-inverse">LET'S TALK</p><h2>Tell us what you're working on.</h2><p>Reach the team through our enquiry form. A phone number is all you need.</p></div><a class="button button-light" href="contact.html#enquiry">Send an enquiry <span aria-hidden="true">↗</span></a></div></section>'''

about=page_intro('THE FIRM','A multidisciplinary approach to development.','Serina Bhasera Consultancy works with developers, landowners, businesses and organisations navigating the built environment in Zimbabwe.')+f'''
<section class="section about-page"><div class="container about-page-grid"><div><p class="kicker">WHO WE ARE</p><h2>Advice that considers the full picture.</h2></div><div class="prose"><p class="prose-lead">Serina Bhasera Consultancy brings together expertise in land planning, environmental consulting, technical design, ESG strategy, governance and strategic advisory.</p><p>Our clients work across property development, construction, commercial enterprise, infrastructure, mining, the public sector and other industries requiring regulatory approvals, technical coordination and long-term planning.</p><p>We support decisions from early project concepts and land use considerations through approvals, compliance and delivery planning.</p></div></div></section>
<section class="image-story"><div class="container image-story-grid"><div class="approach-panel"><p class="approach-panel-eyebrow">A PRACTICAL STARTING POINT</p><h3>From a question to a clear next step.</h3><div class="approach-panel-row"><span>01</span><p>Understand the setting and what you need.</p></div><div class="approach-panel-row"><span>02</span><p>Consider the relevant requirements and disciplines.</p></div><div class="approach-panel-row"><span>03</span><p>Discuss practical options for moving forward.</p></div></div><div class="image-story-text"><p class="kicker">OUR APPROACH</p><h2>Connected thinking for complex requirements.</h2><p>Development decisions often involve multiple disciplines. Land use, environmental obligations, infrastructure and governance considerations may all influence a project.</p><p>Our practice areas bring these perspectives into a single conversation about your particular needs.</p><a class="text-link text-link-dark" href="services.html">Explore our practice areas <span aria-hidden="true">↗</span></a></div></div></section>
<section class="section about-statement"><div class="container about-statement-inner"><div><p class="kicker">OUR SCOPE</p><h2>Serving a range of sectors and organisations.</h2></div><div><p>From commercial and residential development to sustainability reporting, governance and board training, our advisory scope is intentionally broad.</p><a class="text-link text-link-dark" href="sectors.html">View who we serve <span aria-hidden="true">↗</span></a></div></div></section>'''

services_data=[
('01','land-planning','Land Use &amp; Development Planning','We advise on land use strategies and prepare subdivision schemes, change-of-use applications, development permits and master planning work. Our services include liaison with relevant local authorities and statutory bodies.',['Spatial and master planning','Subdivision schemes','Change-of-use applications','Development permits','Zoning advisory']),
('02','environment','Environmental Consulting &amp; EIA','We support environmental impact assessment processes, prospectus preparation, EIA reporting, compliance audits and environmental management planning, with liaison to the Environmental Management Agency where required.',['EIA prospectuses &amp; reports','Environmental compliance audits','EMA liaison','Environmental management plans','Monitoring and reporting']),
('03','sustainability','ESG, Climate &amp; Sustainability','We help organisations assess climate and environmental risks, understand their ESG obligations and prepare sustainability strategies and reporting aligned with relevant frameworks.',['Climate risk assessment','Carbon footprint analysis','ESG reporting','Sustainability strategy','Social impact &amp; stakeholder engagement']),
('04','technical','Technical Design &amp; Infrastructure','We advise on site layout and infrastructure planning, and coordinate architects, civil engineers and specialist consultants in the preparation of technical work for commercial, industrial and residential developments.',['Site layout','Infrastructure coordination','Civil engineering liaison','Technical drawings','Regulatory design considerations']),
('05','estate','Estate Planning &amp; Property Advisory','We assist individuals, families and organisations with land holding structures, title deed processes, succession planning and property portfolio advisory. Asset valuation is also included in the firm’s additional service offering.',['Estate structuring','Subdivision advisory','Succession planning','Title deed processes','Property portfolio advice','Asset valuation']),
('06','governance','Governance, Legal &amp; Strategy','We advise on corporate governance, legal compliance and strategic business planning, including strategy formulation and review, marketing and human resources consulting, and induction and training for board members.',['Governance frameworks','Legal &amp; compliance advisory','Strategy formulation &amp; review','Board training &amp; induction','Marketing &amp; human resources advisory']),
]
services=page_intro('OUR EXPERTISE','Our practice areas.','Services spanning planning, environmental compliance, infrastructure, property, sustainability and organisational strategy.')
services+='<section class="section services-page"><div class="container"><p class="services-page-intro">Each practice area is shaped around practical project requirements, from initial advice and approvals to technical coordination and ongoing strategic support.</p><div class="service-detail-list">'
for num,anchor,title,desc,tags in services_data:
 enquiry_href=f'contact.html?service={anchor}#enquiry'
 estate_will='''<div class="will-cta"><p class="will-eyebrow">WILL PREPARATION &amp; SUCCESSION</p><h3>Let us help you prepare your will.</h3><p>Take the first step towards planning for your family's future. Enquire about professional will-preparation assistance and estate planning. No private family or asset details are needed at this stage.</p><a class="button button-gold" href="contact.html?service=will-preparation#enquiry">Start a will enquiry <span aria-hidden="true">&#8599;</span></a></div>''' if anchor=='estate' else ''
 services+=f'<article class="service-detail" id="{anchor}"><div class="service-detail-title"><span class="service-num">{num} / PRACTICE AREA</span><h2>{title}</h2></div><div class="service-detail-body"><p>{desc}</p><ul class="service-offerings">'+''.join(f'<li>{tag}</li>' for tag in tags)+f'</ul><a class="text-link text-link-dark" href="{enquiry_href}">Enquire about this service <span aria-hidden="true">&#8599;</span></a>{estate_will}</div></article>'
services+='''</div></div></section><section class="additional-services"><div class="container additional-grid"><div><p class="kicker kicker-inverse">ADDITIONAL ADVISORY</p><h2>Related areas of work.</h2></div><div><p>The firm has also identified auditing as an area of service. Specific assignments and requirements can be discussed directly.</p><a class="light-link" href="contact.html">Discuss your requirements <span aria-hidden="true">↗</span></a></div></div></section>'''

sectors_data=[
('fuel','Fuel station developers','Environmental impact assessments, site planning, regulatory liaison and development approvals.'),
('commercial','Commercial &amp; industrial developers','Planning and coordination for warehouses, retail centres, business parks, industrial facilities and mixed-use projects.'),
('residential','Residential estate developers','Subdivision schemes, environmental approvals, estate planning and infrastructure design coordination.'),
('landowners','Individual landowners &amp; families','Land use applications, title deed processes, estate structuring and long-term property planning.'),
('mining','Mining &amp; energy sector','Environmental compliance, EIA support, infrastructure considerations and ESG reporting.'),
('public','NGOs &amp; public-sector bodies','Community land planning, sustainability strategy, governance advisory and reporting.'),
]
sectors=page_intro('WHO WE SERVE','Supporting different sectors and project needs.','Our clients range from individual landowners to organisations undertaking commercial, infrastructure and community projects.')
sectors+='<section class="section sectors-page"><div class="container"><div class="sector-detail-list">'
for i,(anchor,title,desc) in enumerate(sectors_data,1):
 sectors+=f'<article class="sector-detail" id="{anchor}"><span class="sector-detail-num">{i:02d}</span><div><h2>{title}</h2><p>{desc}</p></div><a href="contact.html" aria-label="Contact us about {title.replace("&amp;","and")}">↗</a></article>'
sectors+='</div></div></section>'
sectors+='<section class="callout"><div class="container callout-inner"><div><p class="kicker kicker-inverse">GET IN TOUCH</p><h2>Every project has its own context.</h2><p>Contact the firm about the specific approvals, planning or advisory support you need.</p></div><a class="button button-light" href="contact.html">Contact us <span aria-hidden="true">↗</span></a></div></section>'

contact=page_intro('CONTACT US','Tell us how we can help.','Send an enquiry using your phone or WhatsApp number. An email address is optional.')
contact+="""<section class="section contact-page"><div class="container contact-page-grid"><div class="contact-form-column" id="enquiry"><p class="kicker">SEND AN ENQUIRY</p><h2>How can we assist?</h2><p class="enquiry-intro">Tell us a little about what you need. The team can follow up using your preferred phone number. No email account is required.</p>
<form id="enquiry-form" name="website-enquiry" method="POST" action="/thank-you.html" data-netlify="true" data-netlify-honeypot="bot-field" class="enquiry-form">
<input type="hidden" name="form-name" value="website-enquiry">
<p class="form-honeypot"><label>Leave this field empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div class="form-row"><div class="form-field"><label for="enquiry-name">Full name <span aria-hidden="true">*</span></label><input id="enquiry-name" type="text" name="name" autocomplete="name" maxlength="100" required></div>
<div class="form-field"><label for="enquiry-phone">Phone / WhatsApp number <span aria-hidden="true">*</span></label><input id="enquiry-phone" type="tel" name="phone" autocomplete="tel" inputmode="tel" minlength="7" maxlength="30" placeholder="e.g. +263 77 ..." required></div></div>
<div class="form-row"><div class="form-field"><label for="enquiry-email">Email <span class="optional">(optional)</span></label><input id="enquiry-email" type="email" name="email" autocomplete="email" maxlength="160"></div>
<div class="form-field"><label for="enquiry-service">What do you need help with?</label><select id="enquiry-service" name="service"><option value="general">General enquiry</option><option value="land-planning">Land use &amp; planning</option><option value="environment">Environmental consulting</option><option value="sustainability">ESG &amp; sustainability</option><option value="technical">Technical design &amp; infrastructure</option><option value="estate">Estate &amp; property advice</option><option value="will-preparation">Will preparation</option><option value="governance">Governance &amp; strategy</option><option value="auditing">Auditing</option></select></div></div>
<div class="form-field"><label for="enquiry-message">Your enquiry <span aria-hidden="true">*</span></label><textarea id="enquiry-message" name="message" rows="5" maxlength="1200" placeholder="Briefly describe what you need help with" required></textarea></div>
<p class="form-guidance">For your privacy, do not include identification numbers, beneficiary names, financial records or private documents in this initial enquiry.</p>
<label class="form-consent"><input type="checkbox" name="contact-consent" value="yes" required><span>I agree that the consultancy may use these details to contact me about this enquiry.</span></label>
<button class="button button-primary form-submit" type="submit">Send enquiry <span aria-hidden="true">&#8599;</span></button>
<p id="form-preview-note" class="form-preview-note" tabindex="-1" role="status" hidden>This is a local or GitHub Pages preview. Enquiries can only be sent from the Netlify-hosted website after form handling is enabled.</p>
</form></div>
<div class="contact-details"><p class="kicker">OTHER WAYS TO CONTACT US</p><div class="contact-detail"><span>EMAIL</span><a href="mailto:info@serinabhasera.co.zw">info@serinabhasera.co.zw <span aria-hidden="true">&#8599;</span></a></div><div class="contact-detail"><span>LOCATIONS</span><p>Harare &amp; Masvingo<br>Zimbabwe</p></div><div class="contact-detail contact-detail-last"><span>OUR SERVICES</span><p>Land use &amp; planning, environmental consulting, infrastructure, ESG, estate planning, governance and strategy.</p></div></div></div></section>"""

thanks=page_intro('ENQUIRY RECEIVED','Thank you for getting in touch.','Your enquiry has been submitted. The team will follow up using the contact details you provided.')
thanks+='''<section class="section thanks-section"><div class="container"><div class="thanks-inner"><h2>We look forward to speaking with you.</h2><p>If you need to send another enquiry, you can return to our contact page. Do not send confidential will or financial information by email or through this general enquiry form.</p><a class="button button-primary" href="index.html">Return to the homepage <span aria-hidden="true">&#8594;</span></a></div></div></section>'''

pages=[('index.html','Home','Land planning, environmental consulting, infrastructure, sustainability, governance and strategic advisory in Zimbabwe.','index.html',home),('about.html','About the firm','Learn about Serina Bhasera Consultancy and its multidisciplinary advisory approach in Zimbabwe.','about.html',about),('services.html','Our services','Explore land use planning, environmental impact assessment, technical design, ESG, estate and strategic advisory services.','services.html',services),('sectors.html','Who we serve','Serina Bhasera Consultancy supports property developers, landowners, mining, commercial, NGOs and public bodies.','sectors.html',sectors),('contact.html','Contact','Enquire about Serina Bhasera Consultancy services by phone or WhatsApp, with email optional.','contact.html',contact),('thank-you.html','Thank you','Confirmation for website enquiries.','contact.html',thanks)]
for f,title,desc,active,body in pages:
 (R/f).write_text(page(title,desc,active,body),encoding='utf8')
print('Generated pages:',', '.join(x[0] for x in pages))
