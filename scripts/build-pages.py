from pathlib import Path
R=Path(__file__).resolve().parent.parent
IMAGES={
 'hero':'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
 'interior':'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
}
nav=[('index.html','Home'),('about.html','About the firm'),('services.html','Services'),('sectors.html','Who we serve'),('contact.html','Contact')]

def header(active):
 return f'''<div class="topline"><div class="container topline-inner"><span>HARARE &amp; MASVINGO <span class="topline-dot">·</span> ZIMBABWE</span><span>Strategic Advice. Practical Solutions. Sustainable Results.</span></div></div>
<header class="site-header" id="top">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="Serina Bhasera Consultancy — home"><img src="assets/serina-logo.png" alt="Serina Bhasera Consultancy" width="695" height="168"></a>
    <button type="button" class="menu-toggle" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
    <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
      {''.join(f'<a href="{url}"'+(' aria-current="page"' if active==url else '')+f'>{label}</a>' for url,label in nav)}
      <a class="nav-enquiry" href="mailto:info@serinabhasera.co.zw?subject=Website%20enquiry">Enquire <span aria-hidden="true">↗</span></a>
    </nav>
  </div>
</header>'''

def footer():
 return '''<footer class="footer" id="footer"><div class="container footer-upper"><div class="footer-identity"><p class="footer-name">Serina Bhasera<br><span>Consultancy</span></p><p>Strategic Advice.<br>Practical Solutions.<br>Sustainable Results.</p></div><div class="footer-col"><h2>Explore</h2><a href="index.html">Home</a><a href="about.html">About us</a><a href="services.html">Our services</a><a href="sectors.html">Who we serve</a></div><div class="footer-col"><h2>Contact</h2><a href="mailto:info@serinabhasera.co.zw">info@serinabhasera.co.zw</a><p>Harare &amp; Masvingo<br>Zimbabwe</p><a href="contact.html">Contact information <span aria-hidden="true">↗</span></a></div></div><div class="container footer-lower"><span>© <span data-year>2026</span> Serina Bhasera Consultancy</span><span>Website preview · Content subject to client approval</span><a href="#top">Back to top ↑</a></div></footer>'''

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

# Home — quiet, editorial, brochure-grounded.
home=f'''<section class="hero"><div class="hero-inner"><div class="hero-copy"><div class="hero-copy-inner"><p class="kicker">BUILT ENVIRONMENT &amp; STRATEGIC ADVISORY</p><h1>We guide, plan and design the built environment.</h1><p>Supporting developers, landowners and organisations with land use planning, environmental consulting, technical coordination and strategic advice in Zimbabwe.</p><div class="hero-actions"><a class="button button-primary" href="services.html">Explore our services <span aria-hidden="true">↗</span></a><a class="text-link" href="contact.html">Speak to the firm <span aria-hidden="true">→</span></a></div></div></div><div class="hero-image image-with-fallback"><div class="hero-graphic" aria-hidden="true"><span class="hero-grid-num">OUR PRACTICE</span><span class="hero-graphic-line"></span><span class="hero-graphic-title">Land use.<br>Environment.<br>Strategy.</span></div><img src="{IMAGES['hero']}" width="1400" height="1000" alt="Architectural photograph of modern city buildings; illustrative imagery, not a company project" fetchpriority="high"><span class="hero-photo-rule" aria-hidden="true"></span><div class="hero-image-meta" aria-hidden="true"><span>PLANNING</span><span>ENVIRONMENT</span><span>STRATEGY</span></div></div></div></section>
<div class="location-band"><div class="container"><span>A multidisciplinary approach</span><span>Planning <b>·</b> Environment <b>·</b> Governance <b>·</b> Infrastructure</span></div></div>
<section class="section services-overview" aria-labelledby="services-title"><div class="container"><div class="section-lead"><div><p class="kicker">OUR EXPERTISE</p><h2 id="services-title">Advice across every<br>stage of development.</h2></div><div class="section-lead-aside"><p>From an initial land use decision to environmental compliance, technical planning and organisational strategy, our services are built around the practical needs of each project.</p><a class="text-link text-link-dark" href="services.html">View all services <span aria-hidden="true">↗</span></a></div></div>
<div class="services-list">
<a class="service-tile" href="services.html#land-planning"><span class="service-num">01</span><h3>Land Use &amp;<br>Development Planning</h3><p>Spatial planning, subdivision, development permits and land-use approvals.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#environment"><span class="service-num">02</span><h3>Environmental<br>Consulting &amp; EIA</h3><p>Environmental impact assessments, compliance and regulatory liaison.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#sustainability"><span class="service-num">03</span><h3>ESG, Climate &amp;<br>Sustainability</h3><p>Climate risk, ESG reporting and practical sustainability strategy.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#technical"><span class="service-num">04</span><h3>Technical Design &amp;<br>Infrastructure</h3><p>Site layouts, technical drawings and infrastructure coordination.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#estate"><span class="service-num">05</span><h3>Estate &amp; Property<br>Advisory</h3><p>Estate planning, title processes and property portfolio guidance.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
<a class="service-tile" href="services.html#governance"><span class="service-num">06</span><h3>Governance, Legal<br>&amp; Strategy</h3><p>Governance frameworks, strategy review and board induction.</p><span class="tile-arrow" aria-hidden="true">↗</span></a>
</div></div></section>
<section class="about-feature"><div class="container about-feature-inner"><div><p class="kicker kicker-inverse">ABOUT THE FIRM</p><h2>Connecting technical expertise with sound judgement.</h2></div><div class="about-feature-copy"><p>Serina Bhasera Consultancy is a multidisciplinary advisory firm working across land planning, environmental compliance, technical design and organisational strategy.</p><p>We support the people and institutions shaping Zimbabwe's built environment, from individual landowners to commercial developers and public-sector organisations.</p><a class="light-link" href="about.html">More about the firm <span aria-hidden="true">↗</span></a></div></div></section>
<section class="section sector-section" aria-labelledby="sector-title"><div class="container sector-layout"><div class="sector-copy"><p class="kicker">OUR CLIENTS</p><h2 id="sector-title">Who we work with.</h2><p>Our advisory services support projects of different scales, across both private and public sectors.</p><div class="sector-rows"><a href="sectors.html#fuel">Fuel station developers <span aria-hidden="true">↗</span></a><a href="sectors.html#commercial">Commercial &amp; industrial developers <span aria-hidden="true">↗</span></a><a href="sectors.html#residential">Residential estate developers <span aria-hidden="true">↗</span></a><a href="sectors.html#landowners">Landowners &amp; families <span aria-hidden="true">↗</span></a><a href="sectors.html#mining">Mining &amp; energy <span aria-hidden="true">↗</span></a><a href="sectors.html#public">NGOs &amp; public-sector organisations <span aria-hidden="true">↗</span></a></div></div><div class="sector-image image-with-fallback"><div class="sector-visual-fallback" aria-hidden="true"><span>WHERE WE WORK</span><strong>Developers.<br>Landowners.<br>Institutions.</strong></div><img src="{IMAGES['interior']}" loading="lazy" width="1200" height="900" alt="Modern professional built environment interior; illustrative stock photography"><span class="image-caption">Across sectors and disciplines.</span></div></div></section>
<section class="callout"><div class="container callout-inner"><div><p class="kicker kicker-inverse">YOUR NEXT STEP</p><h2>Have a project to discuss?</h2><p>Tell us what you are planning. We'll direct your enquiry to the right conversation.</p></div><a class="button button-light" href="mailto:info@serinabhasera.co.zw?subject=Project%20enquiry">Email the firm <span aria-hidden="true">↗</span></a></div></section>'''

about=page_intro('THE FIRM','A multidisciplinary approach to development.','Serina Bhasera Consultancy works with developers, landowners, businesses and organisations navigating the built environment in Zimbabwe.')+f'''
<section class="section about-page"><div class="container about-page-grid"><div><p class="kicker">WHO WE ARE</p><h2>Advice that considers the full picture.</h2></div><div class="prose"><p class="prose-lead">Serina Bhasera Consultancy brings together expertise in land planning, environmental consulting, technical design, ESG strategy, governance and strategic advisory.</p><p>Our clients work across property development, construction, commercial enterprise, infrastructure, mining, the public sector and other industries requiring regulatory approvals, technical coordination and long-term planning.</p><p>We support decisions from early project concepts and land use considerations through approvals, compliance and delivery planning.</p></div></div></section>
<section class="image-story"><div class="container image-story-grid"><div class="image-story-visual image-with-fallback"><div class="sector-visual-fallback" aria-hidden="true"><span>THE PRACTICE</span><strong>Planning.<br>Technical design.<br>Advisory.</strong></div><img src="{IMAGES['interior']}" width="1200" height="900" loading="lazy" alt="Illustrative modern built-environment interior"></div><div class="image-story-text"><p class="kicker">OUR APPROACH</p><h2>Joined-up thinking for complex requirements.</h2><p>Development decisions often involve several disciplines at once. Land use, environmental obligations, infrastructure needs and governance considerations need to work together.</p><p>Our practice areas are structured to help clients address these connected requirements in a clear and practical way.</p><a class="text-link text-link-dark" href="services.html">Explore our practice areas <span aria-hidden="true">↗</span></a></div></div></section>
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
 services+=f'<article class="service-detail" id="{anchor}"><div class="service-detail-title"><span class="service-num">{num} / PRACTICE AREA</span><h2>{title}</h2></div><div class="service-detail-body"><p>{desc}</p><ul class="service-offerings">'+''.join(f'<li>{tag}</li>' for tag in tags)+'</ul><a class="text-link text-link-dark" href="contact.html">Enquire about this service <span aria-hidden="true">↗</span></a></div></article>'
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

contact=page_intro('CONTACT US','Let’s discuss your requirements.','Whether you are planning a development or looking for strategic advice, you can start with a direct enquiry to the firm.')
contact+='''<section class="section contact-page"><div class="container contact-page-grid"><div><p class="kicker">START A CONVERSATION</p><h2>Tell us about your project or enquiry.</h2><p>You can contact the firm directly by email. Include a short outline of what you need, your project location if relevant, and the best way to reach you.</p><a class="button button-primary" href="mailto:info@serinabhasera.co.zw?subject=Website%20enquiry">Write an email <span aria-hidden="true">↗</span></a></div><div class="contact-details"><div class="contact-detail"><span>EMAIL</span><a href="mailto:info@serinabhasera.co.zw">info@serinabhasera.co.zw <span aria-hidden="true">↗</span></a></div><div class="contact-detail"><span>LOCATIONS</span><p>Harare &amp; Masvingo<br>Zimbabwe</p></div><div class="contact-detail contact-detail-last"><span>AREAS OF ENQUIRY</span><p>Land use &amp; planning · Environmental consulting · Infrastructure · ESG · Property · Governance &amp; strategy</p></div></div></div></section>'''

pages=[('index.html','Home','Land planning, environmental consulting, infrastructure, sustainability, governance and strategic advisory in Zimbabwe.','index.html',home),('about.html','About the firm','Learn about Serina Bhasera Consultancy and its multidisciplinary advisory approach in Zimbabwe.','about.html',about),('services.html','Our services','Explore land use planning, environmental impact assessment, technical design, ESG, estate and strategic advisory services.','services.html',services),('sectors.html','Who we serve','Serina Bhasera Consultancy supports property developers, landowners, mining, commercial, NGOs and public bodies.','sectors.html',sectors),('contact.html','Contact','Contact Serina Bhasera Consultancy in Zimbabwe about planning, compliance and strategic advisory requirements.','contact.html',contact)]
for f,title,desc,active,body in pages:
 (R/f).write_text(page(title,desc,active,body),encoding='utf8')
print('Generated pages:',', '.join(x[0] for x in pages))
