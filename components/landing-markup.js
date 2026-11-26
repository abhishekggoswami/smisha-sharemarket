import { courses } from '../lib/course-catalog';
import { learnerLocations } from '../lib/learner-locations';

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const instructorImages = { sushil: 'sushil-course-cutout.webp', 'sushil-navy': 'sushil-navy-hero-cutout.webp', 'sushil-olive': 'sushil-olive-hero-cutout.webp', 'sushil-black': 'sushil-black-hero-cutout.webp', 'sushil-value': 'sushil-value-course-cutout.webp', navy: 'instructor-navy-course-cutout.webp', charcoal: 'instructor-charcoal-course-cutout.webp' };
const initialCourseCards = courses.slice(0, 3).map((course) => {
  const href = `/courses/${encodeURIComponent(course.slug)}`;
  const board = course.boardTitle.split('\n').map(line => `<span>${escapeHtml(line)}</span>`).join('');
  const highlights = course.highlights.map(point => `<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>${escapeHtml(point)}</span></li>`).join('');
  return `<article class="course-card course-card-link service-card service-card-link"><a class="course-card-top" href="${href}"><div><p class="course-subtitle">${escapeHtml(course.subtitle)}</p><h3>${escapeHtml(course.title)}</h3><p class="course-description">${escapeHtml(course.description)}</p></div><span class="course-card-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span></a><a href="${href}" aria-label="View ${escapeHtml(course.title)}"><div class="course-art course-art--${escapeHtml(course.theme)} course-instructor-art course-media"><div class="course-whiteboard"><span class="course-board-label">SMISHA ACADEMY</span><strong>${board}</strong><i class="course-board-marker"></i></div><div class="course-card-instructor course-card-instructor--${escapeHtml(course.instructor)}"><img loading="lazy" decoding="async" src="/assets/instructors/${escapeHtml(instructorImages[course.instructor] || instructorImages.sushil)}" alt="" /></div><div class="course-card-benefits"><span>Live learning</span><span>Mentor support</span></div></div></a><div class="course-card-facts"><ul class="course-card-highlights">${highlights}</ul><div class="course-card-schedule"><span>${escapeHtml(course.duration)}</span><span>Offline classes</span></div><p class="course-card-fee">Enquire for fees</p><div class="course-card-footer"><a class="course-details-button" href="${href}">View curriculum</a><a class="course-demo-button" href="/contact?course=${encodeURIComponent(course.title)}">Book a free demo class</a></div></div></article>`;
}).join('');
const galleryFallback = `<div class="academy-accordion academy-fallback" aria-label="Inside Smisha Share Market Academy">${[['academy-classroom-01.webp','Live learning in action'],['academy-classroom-02.webp','Focused classroom sessions'],['academy-classroom-03.webp','Practice that feels real'],['academy-office-01.webp','Support behind the scenes'],['academy-office-02.webp','Preparation in progress'],['academy-mentor-cabin-01.webp','Mentor-led market room']].map(([image,label],index)=>`<div class="academy-accordion-panel${index === 0 ? ' is-active' : ''}"><span class="academy-accordion-media"><img src="/assets/academy-gallery/${image}" alt="${label}" loading="lazy" decoding="async" /></span><span class="academy-accordion-shade"></span><span class="academy-accordion-caption"><i></i><span>${label}</span></span></div>`).join('')}</div>`;
const indiaZones = ['left-upper', 'right-upper', 'left-mid', 'right-mid', 'left-lower', 'right-lower', 'left-far', 'right-far', 'left-bottom', 'right-bottom'];
const indiaCards = learnerLocations.slice(0, indiaZones.length).map((review, index) => `<article class="india-review-card india-review-card--${indiaZones[index]} india-review-card--${escapeHtml(review.size)}${index === 0 ? ' is-active' : ''}"><div class="india-review-card-head"><span class="india-google-brand">Reviews</span></div><div class="india-review-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><div class="india-review-profile"><img src="${escapeHtml(review.avatar)}" alt="" loading="lazy" decoding="async" /><div><strong>${escapeHtml(review.studentName)}</strong><small>${escapeHtml(review.city)}, ${escapeHtml(review.state)}</small></div></div><p>${escapeHtml(review.reviewText)}</p></article>`).join('');
export const indiaFallback = `<section class="india-testimonials-section is-visible india-fallback" aria-labelledby="india-fallback-title"><div class="india-testimonials-inner"><header class="india-testimonials-heading"><p class="section-kicker">STUDENTS ACROSS INDIA</p><h2 id="india-fallback-title">Trusted Across India</h2><p>Sample reviews shown for design preview; replace with verified learner feedback before publishing.</p></header><div class="india-review-map-layout"><div class="india-map-panel"><div class="india-map-glow"></div><img class="india-state-map india-fallback-map" src="/assets/maps/india-fallback.svg" alt="Map of India" decoding="async" /></div>${indiaCards}</div><a class="india-map-credit" href="https://www.openstreetmap.org/copyright">Map data &copy; OpenStreetMap contributors</a></div></section>`;

export const landingMarkup = String.raw`
<main class="page-shell">
      <div class="site-topbar">
        <div class="topbar-inner">
          <div class="topbar-contact">
            <a href="mailto:support@smishasharemarket.com"><i class="fa-regular fa-envelope"></i>support@smishasharemarket.com</a>
            <a href="tel:+917420001687"><i class="fa-solid fa-phone"></i>+91 7420001687</a>
            <a href="tel:+917420040030"><i class="fa-solid fa-phone"></i>+91 7420040030</a>
          </div>
          <div class="topbar-socials" aria-label="Social media links">
            <a href="https://www.facebook.com/SmishaShareMarketClasses" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/smisha_share_market?igsh=MXd3bHVpeGhxazNlMA%3D%3D&utm_source=qr" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://t.me/smishasharemarket" aria-label="Telegram"><i class="fa-brands fa-telegram"></i></a>
            <a href="https://in.linkedin.com/company/smishasharemarket" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="https://www.youtube.com/@smishasharemarket" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="https://wa.me/919595150577" target="_blank" rel="noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
      <header class="site-header">
        <a class="brand" href="#top" aria-label="Bisco home">
          <img decoding="async" class="brand-logo" src="/assets/smisha-logo-dark.png" alt="Smisha Share Market Classes" />
          <span class="brand-tagline">Share Market Academy</span>
        </a>
        <nav class="desktop-nav" id="primary-navigation" aria-label="Primary navigation">
          <a href="#top">Homepage</a>
          <a href="/about">About Us</a>
          <a href="/courses">Courses</a><a href="/workshops">Workshops</a>
          <a href="#services">Programs <span class="chevron">⌄</span></a>
          <a href="#stories">Mentorship <span class="chevron">⌄</span></a>
          <a href="#pages">Resources <span class="chevron">⌄</span></a>
          <a href="/contact">Contact</a>
        </nav>
        <div class="header-actions">
          <a class="appointment" href="#contact">Book a<br />demo</a>
          <button class="menu-button" type="button" aria-label="Open menu" aria-controls="primary-navigation" aria-expanded="false"><span></span><span></span></button>
        </div>
      </header>

      <section class="hero" id="top" aria-label="Smisha Share Market Academy">
        <div class="home-split-hero-mount">
          <div class="home-split-hero" aria-labelledby="home-split-title">
            <div class="home-split-video-panel">
              <video class="home-split-video" autoplay muted loop playsinline preload="auto" aria-hidden="true"><source src="/assets/hero-background.mp4" type="video/mp4" /></video>
              <div class="home-split-video-wash" aria-hidden="true"></div>
              <div class="home-split-copy home-split-copy--visible">
                <p class="home-split-kicker">Pune's share market academy</p>
                <h1 id="home-split-title"><span class="home-split-heading-line">Learn markets.</span><span class="home-split-heading-line home-split-heading-accent">Trade <em class="heading-gold">with clarity.</em></span></h1>
                <p>Live market classes, expert mentorship, and risk-first training for decisions you can stand behind.</p>
                <a class="home-split-cta" href="/contact">Book a free consultation <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
              </div>
              <div class="home-split-socials" aria-label="Follow Smisha Share Market">
                <a href="https://www.facebook.com/SmishaShareMarketClasses" target="_blank" rel="noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i><span>Facebook</span></a>
                <a href="https://www.instagram.com/smisha_share_market" target="_blank" rel="noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i><span>Instagram</span></a>
                <a href="https://www.youtube.com/@smishasharemarket" target="_blank" rel="noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube" aria-hidden="true"></i><span>YouTube</span></a>
                <a href="https://in.linkedin.com/company/smishasharemarket" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i><span>LinkedIn</span></a>
              </div>
              <div class="home-split-info-card"><span class="home-split-info-number">01.</span><strong class="home-split-info-title">Live Classes</strong><p>Learn directly from live market sessions and real chart discussions.</p></div>
            </div>
            <div class="home-split-gallery-panel home-split-gallery-fallback">
              <img class="home-split-gallery-image home-split-gallery-image--0 is-active" src="/assets/home-hero/business-news.webp" alt="A person reading the business section of a newspaper" fetchpriority="high" />
              <img class="home-split-gallery-image home-split-gallery-image--1" src="/assets/home-hero/market-quotes.webp" alt="" />
              <img class="home-split-gallery-image home-split-gallery-image--2" src="/assets/home-hero/buy-sell.webp" alt="" />
              <img class="home-split-gallery-image home-split-gallery-image--3" src="/assets/home-hero/trading-workspace.webp" alt="" />
              <div class="home-split-gallery-wash" aria-hidden="true"></div>
              <a class="home-split-read-more" href="/courses">Read More <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
        <div class="keynote-glow keynote-glow-one" aria-hidden="true"></div>
        <div class="keynote-glow keynote-glow-two" aria-hidden="true"></div>
        <div class="smisha-hero-lightwash" aria-hidden="true"></div>
        <div class="smisha-hero-architecture" aria-hidden="true"></div>
        <div class="smisha-hero-bull" aria-hidden="true"></div>
        <div class="smisha-hero-grid" aria-hidden="true"></div>
        <div class="smisha-hero-candles" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="keynote-hero-inner">
          <div class="keynote-copy">
            <div class="keynote-heading">
              <p class="keynote-kicker">PUNE'S LEADING SHARE MARKET ACADEMY</p>
              <h1 id="keynote-title" class="keynote-title"><span>Pune learns to trade</span><em>with Smisha,</em><span>then trades with confidence.</span></h1>
              <h1 class="keynote-title-mobile"><span>Learn</span><span class="mobile-title-to">to</span><span>trade</span><span>with</span><em>Smisha</em></h1>
            </div>
            <div class="keynote-actions">
              <p class="keynote-description">Live market classes, expert mentorship, and risk-first training for Pune learners who want to understand the market, make better decisions, and build lasting confidence.</p>
              <a href="/contact" class="keynote-button"><i class="fa-regular fa-calendar-days keynote-calendar-icon" aria-hidden="true"></i><span>Get your free consultation</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
              <p class="keynote-note"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Pune-based. Live, online, and offline learning.</p>
            </div>
          </div>
          <div class="keynote-stage" aria-hidden="true">
            <img decoding="async" loading="lazy" class="keynote-speaker keynote-speaker--one" src="/assets/sushil-keynote-mic-01.webp" alt="" />
            <img decoding="async" loading="lazy" class="keynote-speaker keynote-speaker--two" src="/assets/sushil-keynote-mic-02.webp" alt="" />
            <img decoding="async" loading="lazy" class="keynote-speaker keynote-speaker--three" src="/assets/sushil-keynote-mic-03.webp" alt="" />
          </div>
          <div class="mobile-hero-trust" aria-label="Trusted by more than 2,500 learners in Pune">
            <div class="mobile-hero-faces" aria-hidden="true"><span></span><span></span><span></span></div>
            <p>Trusted by <strong>2,500+</strong><br />learners in Pune</p>
          </div>
        </div>
        <div class="home-hero-video-mount"></div>
        <div class="video-overlay" aria-hidden="true"></div>
        <div class="orbit orbit-left" aria-hidden="true"></div>
        <div class="orbit orbit-right" aria-hidden="true"></div>
        <div class="hero-inner">
          <p class="eyebrow">India’s Practical Stock Market Academy</p>
          <h1 id="hero-title" class="hero-title" aria-label="Master the Art of Trading and Investing"><strong><i class="hero-word" style="--word-delay:.08s">Master</i> <i class="hero-word" style="--word-delay:.18s">the</i> <i class="hero-word" style="--word-delay:.28s">Art</i> <i class="hero-word" style="--word-delay:.38s">of</i></strong><span><i class="hero-word" style="--word-delay:.51s">Trading</i> <i class="hero-word" style="--word-delay:.62s">&amp;</i> <i class="hero-word" style="--word-delay:.71s">Investing</i></span></h1>

          <div class="hero-content">
            <div class="intro-copy">
              <p><b>Learn smarter.</b> Build market confidence with live, practical training in Equity, Forex, and Crypto—from beginner to advanced.</p>
              <a href="#contact" class="primary-button">Book a Demo</a>
              <div class="client-proof">
                <div class="faces" aria-hidden="true">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <p><b>2500+ students</b> are learning to trade smarter</p>
              </div>
            </div>

            <div class="person-stage">
              <div class="person-glow" aria-hidden="true"></div>
              <img decoding="async" src="/assets/smisha-coach-hero-pointing.webp" alt="Smisha Share Market instructor pointing upward" />
            </div>

            <div class="progress-card" aria-label="Consulting performance metrics">
              <div class="metric"><div><span>Technical Analysis</span><b>92%</b></div><i><em style="--progress:92%"></em></i></div>
              <div class="metric"><div><span>Risk Management</span><b>88%</b></div><i><em style="--progress:88%"></em></i></div>
              <div class="metric"><div><span>Trading Psychology</span><b>95%</b></div><i><em style="--progress:95%"></em></i></div>
            </div>
          </div>
        </div>
      </section>

      <div class="landing-proof-bridge">
        <div class="home-proof-cards landing-proof-cards" aria-label="Why learners choose Smisha Share Market">
          <article class="home-proof-card"><i class="fa-solid fa-chart-line" aria-hidden="true"></i><div><strong>Live market classes</strong><p>Learn how market decisions take shape on real charts.</p></div></article>
          <article class="home-proof-card"><i class="fa-solid fa-user-tie" aria-hidden="true"></i><div><strong>Expert-led mentorship</strong><p>Get clear guidance from a Pune-based market educator.</p></div></article>
          <article class="home-proof-card"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><div><strong>Risk-first training</strong><p>Build a disciplined approach before you risk capital.</p></div></article>
          <article class="home-proof-card"><i class="fa-solid fa-users" aria-hidden="true"></i><div><strong>2,500+ students trained</strong><p>A growing Pune community learning the market the right way.</p></div></article>
        </div>
      </div>

      <div class="home-brand-interlude" aria-hidden="true">
        <div class="home-brand-interlude-track">
          <div class="home-brand-interlude-group"><span class="home-brand-interlude-word"><span class="home-brand-letter" data-letter="S">S</span><span class="home-brand-letter" data-letter="m">m</span><span class="home-brand-letter" data-letter="i">i</span><span class="home-brand-letter" data-letter="s">s</span><span class="home-brand-letter" data-letter="h">h</span><span class="home-brand-letter" data-letter="a">a</span></span><span class="home-brand-interlude-mark">✳</span><span class="home-brand-interlude-word"><span class="home-brand-letter" data-letter="S">S</span><span class="home-brand-letter" data-letter="m">m</span><span class="home-brand-letter" data-letter="i">i</span><span class="home-brand-letter" data-letter="s">s</span><span class="home-brand-letter" data-letter="h">h</span><span class="home-brand-letter" data-letter="a">a</span></span><span class="home-brand-interlude-mark">✳</span></div>
          <div class="home-brand-interlude-group"><span class="home-brand-interlude-word"><span class="home-brand-letter" data-letter="S">S</span><span class="home-brand-letter" data-letter="m">m</span><span class="home-brand-letter" data-letter="i">i</span><span class="home-brand-letter" data-letter="s">s</span><span class="home-brand-letter" data-letter="h">h</span><span class="home-brand-letter" data-letter="a">a</span></span><span class="home-brand-interlude-mark">✳</span><span class="home-brand-interlude-word"><span class="home-brand-letter" data-letter="S">S</span><span class="home-brand-letter" data-letter="m">m</span><span class="home-brand-letter" data-letter="i">i</span><span class="home-brand-letter" data-letter="s">s</span><span class="home-brand-letter" data-letter="h">h</span><span class="home-brand-letter" data-letter="a">a</span></span><span class="home-brand-interlude-mark">✳</span></div>
        </div>
      </div>

      <section class="market-growth-section" aria-labelledby="market-growth-title">
        <div class="market-growth-chart" aria-hidden="true"></div>
        <div class="market-growth-layout">
          <div class="market-growth-image">
            <img src="/assets/financial-growth-tree-v2.png" alt="A leafy tree growing from gold coins, held by a grayscale hand in front of a peach marble panel" loading="lazy" decoding="async" />
            <img class="market-growth-watermark" src="/assets/smisha-logo-black-transparent.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <div class="market-growth-copy">
            <p class="market-growth-kicker">A better way to learn the market</p>
            <h2 class="market-growth-heading-slot" id="market-growth-title">
              <span class="market-growth-heading-line">Learn with confidence.</span>
              <span class="market-growth-heading-line market-growth-heading-accent">Grow <em class="heading-gold">with discipline.</em></span>
            </h2>
            <p class="market-growth-description">For over 10 years, Smisha Share Market has helped Pune learners build practical stock-market skills. Our mentor-led courses connect chart reading and market behavior with risk management and disciplined decision-making—so you can build your knowledge step by step, not chase shortcuts.</p>
            <div class="market-growth-points">
              <article class="market-growth-point">
                <h3>Build a clear foundation</h3>
                <p>Understand price action, technical analysis, and market structure through guided lessons and practical examples.</p>
              </article>
              <article class="market-growth-point">
                <h3>Make more considered decisions</h3>
                <p>Learn to plan trades, manage risk, and review your choices with a process designed to build consistency.</p>
              </article>
            </div>
            <a class="market-growth-cta" href="#services">Explore our courses</a>
          </div>
        </div>
      </section>

      <section class="below-hero" id="about" aria-label="Smisha learning programmes">
        <div class="feature-cards">
          <article class="feature-card">
            <div class="feature-icon" aria-hidden="true"><i class="fa-solid fa-chart-line"></i></div>
            <div><h2>Technical Analysis &amp;<br />Chart Reading</h2><p>Master price action, trends, and high-probability setups.</p></div>
          </article>
          <article class="feature-card">
            <div class="feature-icon" aria-hidden="true"><i class="fa-solid fa-shield-halved"></i></div>
            <div><h2>Risk Management &amp;<br />Position Sizing</h2><p>Protect your capital with disciplined, practical trade plans.</p></div>
          </article>
          <article class="feature-card">
            <div class="feature-icon" aria-hidden="true"><i class="fa-solid fa-people-group"></i></div>
            <div><h2>Live Market<br />Mentorship</h2><p>Build confidence through guided practice and real chart sessions.</p></div>
          </article>
        </div>

        <section class="services-section" id="services" aria-labelledby="services-title">
          <div class="home-courses-slot"><div class="home-courses-carousel home-courses-fallback"><div class="services-heading"><div><p class="section-kicker">Learn With Smisha</p><h2 id="services-title"><strong>Explore our courses.</strong><span>Build your <em class="heading-gold">market</em> edge.</span></h2><p class="section-subheading services-subheading">Learn practical market skills with guided courses designed for every stage of your journey.</p></div><div class="services-actions"><a class="services-button" href="/courses">Explore courses &#8594;</a></div></div><div class="services-carousel-viewport"><div class="services-grid">${initialCourseCards}</div></div></div></div>
        </section>

        <section class="academy-gallery-section" aria-labelledby="academy-gallery-title">
          <div class="academy-gallery-heading"><div><p class="section-kicker">Inside Smisha</p><h2 id="academy-gallery-title" class="academy-gallery-title-slot"><span class="academy-gallery-title-line">See the work behind</span><span class="academy-gallery-title-line academy-gallery-title-accent">stronger <em class="heading-gold">market</em> decisions.</span></h2></div><p>Focused learning, practical preparation, and a team that stays close to every learner's progress.</p></div>
          <div class="academy-gallery-slot">${galleryFallback}</div>
        </section>

        <section class="credibility-section" aria-labelledby="credibility-title">
          <div class="credibility-inner">
            <div class="credibility-heading">
              <p class="credibility-kicker">A MORE THOUGHTFUL START</p>
              <h2 id="credibility-title"><span>Enroll with confidence,</span><strong>in <em class="heading-gold">five</em> simple steps.</strong></h2>
              <p class="credibility-lead">Getting started is simple. Follow these steps to find the learning path that fits your goals.</p>
            </div>
            <div class="enrollment-flow-wrap">
              <svg class="enrollment-connectors" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
                <defs><marker id="enrollment-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1l5 3-5 3" fill="none" stroke="currentColor" stroke-width="1.2"/></marker></defs>
                <path d="M180 132 C180 187 260 162 290 216"/><path d="M470 216 C475 158 543 183 565 132"/><path d="M650 132 C650 187 732 162 762 216"/><path d="M940 216 C945 160 1010 182 1030 132"/>
              </svg>
              <ol class="enrollment-flow">
                <li class="enrollment-step"><div class="enrollment-tab"><span>01</span><h3>Explore</h3></div><div class="enrollment-card-body"><span class="enrollment-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M17 27c-3-2.3-4.7-5-4.7-8.5a11.7 11.7 0 0 1 23.4 0c0 3.5-1.7 6.2-4.7 8.5-1.4 1.1-2 2.6-2 4h-10c0-1.4-.6-2.9-2-4Z" fill="#D4AF37" fill-opacity=".28"/><path d="M17 27c-3-2.3-4.7-5-4.7-8.5a11.7 11.7 0 0 1 23.4 0c0 3.5-1.7 6.2-4.7 8.5-1.4 1.1-2 2.6-2 4h-10c0-1.4-.6-2.9-2-4ZM19 35h10m-8 4h6M24 1v4M4 19H1m46 0h-3M8.5 5l2.5 2.5M39.5 5 37 7.5"/></svg></span><p>Browse our courses and discover what you would like to learn.</p></div></li>
                <li class="enrollment-step"><div class="enrollment-tab"><span>02</span><h3>Choose</h3></div><div class="enrollment-card-body"><span class="enrollment-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="5" fill="#D4AF37" fill-opacity=".4"/><path d="M24 2v8M24 38v8M2 24h8M38 24h8"/></svg></span><p>Choose a learning path that suits your experience and goals.</p></div></li>
                <li class="enrollment-step"><div class="enrollment-tab"><span>03</span><h3>Connect</h3></div><div class="enrollment-card-body"><span class="enrollment-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M11 7h19l7 7v27H11zM30 7v7h7M16 18h15M16 23h10M16 28h8"/><circle cx="32" cy="32" r="10" fill="#D4AF37" fill-opacity=".35"/><path d="m27 32 3.5 3.5L37 28"/></svg></span><p>Talk to our team about course details and your questions.</p></div></li>
                <li class="enrollment-step"><div class="enrollment-tab"><span>04</span><h3>Experience</h3></div><div class="enrollment-card-body"><span class="enrollment-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M5 17 14 8h20l9 9-19 23L5 17Z" fill="#D4AF37" fill-opacity=".25"/><path d="M5 17 14 8h20l9 9-19 23L5 17Zm0 0h38M14 8l5 9 5 23 5-23 5-9M19 17l5-9 5 9"/></svg></span><p>Book a free demo to explore the learning experience.</p></div></li>
                <li class="enrollment-step"><div class="enrollment-tab"><span>05</span><h3>Begin</h3></div><div class="enrollment-card-body"><span class="enrollment-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M6 41h37M9 40V29h7v11M20 40V22h7v18M31 40V12h7v28"/><path d="M9 24 20 17l8 1 11-10M34 8h5v5"/><path d="M31 12h7v28h-7z" fill="#D4AF37" fill-opacity=".35"/></svg></span><p>Confirm the details with our team and start learning.</p></div></li>
              </ol>
            </div>
            <a class="credibility-roadmap-link" href="/contact">Talk to our team <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </div>
        </section>

        <section class="stories-section" id="stories" aria-labelledby="stories-title">
          <div class="stories-header"><p class="section-kicker">Pune Learner Stories</p><h2 id="stories-title"><strong>Real students.</strong><span>Stronger <em class="heading-gold">market</em> decisions.</span></h2><p class="section-subheading stories-subheading">Hear from learners about their experiences and the confidence they built along the way.</p></div>
          <div class="stories-viewport" aria-live="polite">
            <div class="stories-track" data-carousel-track>
              <article class="story-slide" data-story="1">
                <div class="story-thumbnail feedback-video"><a class="student-feedback-frame student-feedback-card feedback-story-card feedback-story-card--yashi" href="https://youtube.com/shorts/TjuVVc2im7Q?si=ZienboG0uouFBPBf" target="_blank" rel="noreferrer" aria-label="Watch Yashi's feedback on YouTube"><div class="feedback-story-copy"><small>STUDENT SUCCESS STORY</small><strong>Yashi</strong><p>Hear it in her own words.</p></div><div class="feedback-story-portrait"><img decoding="async" src="/assets/testimonials/yashi-feedback-scene-v6.webp" alt="Yashi seated in a bright indoor learning lounge" loading="lazy" /></div><img class="feedback-story-brand" src="/assets/smisha-logo-black-transparent.png" alt="" aria-hidden="true" decoding="async" /><span class="feedback-story-play"><i class="fa-solid fa-play" aria-hidden="true"></i> Watch feedback</span></a></div>
                <div class="story-testimonial"><p class="story-label">STUDENT FEEDBACK</p><blockquote>Watch Yashi share her learning experience with Smisha Share Market.</blockquote><a href="https://youtube.com/shorts/TjuVVc2im7Q?si=ZienboG0uouFBPBf" class="story-link" target="_blank" rel="noreferrer">Watch on YouTube <span>➜</span></a><div class="story-person"><div><strong>Yashi</strong><span>Smisha Student</span></div><em>Yashi</em></div></div>
              </article>
              <article class="story-slide" data-story="2">
                <div class="story-thumbnail feedback-video"><a class="student-feedback-frame student-feedback-card feedback-story-card feedback-story-card--anadi" href="https://youtube.com/shorts/R-BCmUC2Xn4?si=bsDnNTGyRAn4IEH5" target="_blank" rel="noreferrer" aria-label="Watch Anadi's feedback on YouTube"><div class="feedback-story-copy"><small>STUDENT SUCCESS STORY</small><strong>Anadi</strong><p>Hear it in his own words.</p></div><div class="feedback-story-portrait"><img decoding="async" src="/assets/testimonials/anadi-feedback-scene-v6.webp" alt="Anadi seated in a bright living room" loading="lazy" /></div><img class="feedback-story-brand" src="/assets/smisha-logo-black-transparent.png" alt="" aria-hidden="true" decoding="async" /><span class="feedback-story-play"><i class="fa-solid fa-play" aria-hidden="true"></i> Watch feedback</span></a></div>
                <div class="story-testimonial"><p class="story-label">STUDENT FEEDBACK</p><blockquote>Watch Anadi share his learning experience with Smisha Share Market.</blockquote><a href="https://youtube.com/shorts/R-BCmUC2Xn4?si=bsDnNTGyRAn4IEH5" class="story-link" target="_blank" rel="noreferrer">Watch on YouTube <span>➜</span></a><div class="story-person"><div><strong>Anadi</strong><span>Smisha Student</span></div><em>Anadi</em></div></div>
              </article>
              <article class="story-slide" data-story="3">
                <div class="story-thumbnail feedback-video"><a class="student-feedback-frame student-feedback-card feedback-story-card feedback-story-card--amit" href="https://youtube.com/shorts/G7krrQzBoPA?si=W_u_MjEX72NU-xRn" target="_blank" rel="noreferrer" aria-label="Watch Amit's feedback on YouTube"><div class="feedback-story-copy"><small>STUDENT SUCCESS STORY</small><strong>Amit</strong><p>Hear it in his own words.</p></div><div class="feedback-story-portrait"><img decoding="async" src="/assets/testimonials/amit-feedback-scene-v6.webp" alt="Amit seated at a study table" loading="lazy" /></div><img class="feedback-story-brand" src="/assets/smisha-logo-black-transparent.png" alt="" aria-hidden="true" decoding="async" /><span class="feedback-story-play"><i class="fa-solid fa-play" aria-hidden="true"></i> Watch feedback</span></a></div>
                <div class="story-testimonial"><p class="story-label">STUDENT FEEDBACK</p><blockquote>Watch Amit share his learning experience with Smisha Share Market.</blockquote><a href="https://youtube.com/shorts/G7krrQzBoPA?si=W_u_MjEX72NU-xRn" class="story-link" target="_blank" rel="noreferrer">Watch on YouTube <span>→</span></a><div class="story-person"><div><strong>Amit</strong><span>Smisha Student</span></div><em>Amit</em></div></div>
              </article>
            </div>
          </div>
          <div class="story-carousel-controls"><div class="story-progress" aria-hidden="true"><span class="active"></span><span></span><span></span></div><div class="story-arrows"><button type="button" data-story-prev aria-label="Previous learner story"><span aria-hidden="true">‹</span></button><button type="button" data-story-next aria-label="Next learner story"><span aria-hidden="true">›</span></button></div></div>
        </section>

        <div class="india-testimonials-slot">${indiaFallback}</div>

        <div class="cta-faq-background">
        <section class="faq-section" id="faq" aria-labelledby="faq-title">
          <div class="faq-heading">
            <div>
              <p class="section-kicker">CLEAR ANSWERS. SMARTER STARTS.</p>
              <h2 id="faq-title"><strong>Your questions,</strong><span class="faq-title-accent">answered <em class="heading-gold">with clarity.</em></span></h2>
              <p>Practical details for learners ready to take their first confident step into the market.</p>
            </div>
            <a class="faq-all-link" href="/contact">Ask our team <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </div>
          <div class="faq-layout">
            <div class="faq-list">
              <details class="faq-item"><summary>Are your stock market courses suitable for beginners?</summary><p>Yes. We begin with clear fundamentals and build step by step, so you can learn with confidence even if you are completely new to the market.</p></details>
              <details class="faq-item"><summary>Do you provide live market sessions?</summary><p>Yes. Our learning experience includes practical chart discussions and live-market guidance to help you connect concepts with real trading situations.</p></details>
              <details class="faq-item"><summary>Which markets and strategies can I learn?</summary><p>You can learn equity, derivatives, forex, and crypto concepts along with technical analysis, risk management, and trading psychology.</p></details>
              <details class="faq-item"><summary>Are the classes available online and offline?</summary><p>Yes. Smisha Share Market offers flexible learning options so you can choose the format that best fits your schedule and learning style.</p></details>
              <details class="faq-item" open><summary>Will I receive mentorship after joining?</summary><p>Yes. You receive continued guidance, doubt support, and practical feedback to help you improve your market understanding and build disciplined trading habits.</p></details>
            </div>
            <aside class="faq-help-card">
              <span class="faq-help-icon" aria-hidden="true"><i class="fa-solid fa-compass"></i></span>
              <p class="faq-help-eyebrow">PERSONAL GUIDANCE</p>
              <h3>Find the course path that fits you.</h3>
              <p>Tell us where you are in your learning journey. We’ll help you choose a practical next step.</p>
              <div class="faq-help-points"><span><i class="fa-solid fa-check" aria-hidden="true"></i> Beginner-friendly guidance</span><span><i class="fa-solid fa-check" aria-hidden="true"></i> Clear course direction</span></div>
              <a href="#contact">Talk to an advisor <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
            </aside>
          </div>
        </section>
        </div>

        <section class="home-location-section" aria-labelledby="home-location-title">
          <div class="home-map-frame"><div class="academy-map-slot" style="height:100%;width:100%"><div class="academy-map"><iframe src="https://maps.google.com/maps?q=Smisha%20Share%20Market%20Institute%2C%20Kharadi%2C%20Pune&amp;t=k&amp;z=18&amp;output=embed" title="Smisha Share Market Institute location on Google Maps" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></div><div class="home-map-overlay"><p class="section-kicker">Visit Smisha In Pune</p><h2 id="home-location-title"><strong>Learn where market</strong><span><em class="heading-gold">confidence</em> is built.</span></h2><p>Visit the academy, meet the team, and explore practical stock market learning built for real progress.</p><a href="/contact">Plan your visit <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a><a class="home-map-external" href="https://www.google.com/maps/search/?api=1&amp;query=Smisha%20Share%20Market%20Institute%2C%20Kharadi%2C%20Pune" target="_blank" rel="noopener noreferrer">Open in Google Maps <span aria-hidden="true">&#8599;</span></a></div></div>
        </section>

        <div class="cta-faq-background">
        <section class="final-demo-cta" id="book-demo" aria-labelledby="final-demo-title">
          <div class="final-demo-grainient-slot" aria-hidden="true"></div>
          <div class="final-demo-candles" aria-hidden="true"></div>
          <div class="final-demo-content-slot">
          <div class="final-demo-card">
            <div class="final-demo-avatars" aria-hidden="true">
              <img src="/assets/students/student-1.jpeg" alt="" loading="lazy" decoding="async" />
              <img src="/assets/students/student-2.jpeg" alt="" loading="lazy" decoding="async" />
              <img src="/assets/students/student-3.jpeg" alt="" loading="lazy" decoding="async" />
            </div>
            <h2 id="final-demo-title">Get tomorrow&apos;s<br /><span>competitive <em class="heading-gold">edge</em> today</span></h2>
            <p class="final-demo-copy">Start with a free demo and discover a practical learning path built around your market goals.</p>
            <button class="final-demo-button" type="button" data-open-conversation>Let&apos;s Start a Conversation <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
          </div>
          <div class="final-demo-partners" aria-label="Market platform partners">
            <p>Trusted by learners · Connected with leading market platforms</p>
            <div class="final-demo-logos">
              <img src="/assets/about/angel-one-logo.webp" alt="Angel One" loading="lazy" decoding="async" />
              <img src="/assets/about/dhan-logo.webp" alt="Dhan" loading="lazy" decoding="async" />
            </div>
          </div>
          </div>
        </section>
        </div>

        <footer class="site-footer" id="contact">
          <div class="footer-contact-strip">
            <span class="footer-ring ring-a" aria-hidden="true"></span><span class="footer-ring ring-b" aria-hidden="true"></span><span class="footer-ring ring-c" aria-hidden="true"></span>
            <p>Ready to start your trading journey?</p>
            <a href="mailto:support@smishasharemarket.com"><span class="footer-mail-icon"><i class="fa-regular fa-envelope" aria-hidden="true"></i></span><span><small>Send us an email</small><span class="footer-email-address">support@<wbr />smishasharemarket.com</span></span></a>
          </div>
          <div class="footer-main">
            <section class="footer-brand" aria-label="Smisha Share Market">
              <a class="footer-logo" href="#top"><img decoding="async" loading="lazy" src="/assets/smisha-logo-dark.png" alt="Smisha Share Market Classes" /></a>
              <p>Pune's practical share market academy for knowledge, discipline, and earned market confidence.</p>
              <div class="footer-socials social-login-icons" aria-label="Social media links">
                <a class="socialcontainer social-instagram" href="https://www.instagram.com/smisha_share_market?stkn=c2ltZjM4NHI0NWtl" target="_blank" rel="noreferrer" aria-label="Instagram"><span class="social-icon social-icon-primary"><i class="fa-brands fa-instagram" aria-hidden="true"></i></span><span class="social-icon social-icon-reveal"><i class="fa-brands fa-instagram" aria-hidden="true"></i></span></a>
                <a class="socialcontainer social-linkedin" href="https://www.linkedin.com/company/smishasharemarket/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><span class="social-icon social-icon-primary"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></span><span class="social-icon social-icon-reveal"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></span></a>
                <a class="socialcontainer social-youtube" href="https://youtube.com/@smishasharemarket?si=qjirOFVlyB8LjEW_" target="_blank" rel="noreferrer" aria-label="YouTube"><span class="social-icon social-icon-primary"><i class="fa-brands fa-youtube" aria-hidden="true"></i></span><span class="social-icon social-icon-reveal"><i class="fa-brands fa-youtube" aria-hidden="true"></i></span></a>
                <a class="socialcontainer social-whatsapp" href="https://wa.me/919595150577" target="_blank" rel="noreferrer" aria-label="WhatsApp"><span class="social-icon social-icon-primary"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></span><span class="social-icon social-icon-reveal"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></span></a>
              </div>
            </section>
            <section class="footer-links"><h2>Academy</h2><a href="/about">About Us</a><a href="#services">Our Programs</a><a href="#stories">Student Stories</a><a href="#book-demo">Book a Demo</a></section>
            <section class="footer-links"><h2>Learning Paths</h2><a href="#services">Equity Trading</a><a href="#services">Technical Analysis</a><a href="#services">Risk Management</a><a href="#services">Trading Psychology</a><a href="#faq">FAQs</a></section>
            <section class="footer-newsletter"><h2>Newsletter</h2><p>Get market-learning tips and academy updates.</p><div class="newsletter-input"><input type="email" aria-label="Email address" placeholder="Enter your email" /><button type="button" aria-label="Subscribe"><i class="fa-solid fa-arrow-right"></i></button></div><small><i class="fa-regular fa-bell" aria-hidden="true"></i> No spam—just useful trading insights.</small></section>
          </div>
          <div class="footer-bottom"><p>© 2026 Smisha Share Market Classes. All rights reserved.</p><div><a href="/terms-and-conditions">Terms &amp; Conditions</a><a href="/privacy-policy">Privacy Policy</a><a href="/legal">Legal</a></div></div>
        </footer>
      </section>
</main>
`;
