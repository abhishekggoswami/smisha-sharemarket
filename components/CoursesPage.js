'use client';

import { useEffect, useState } from 'react';
import { SiteFAQ, SiteFooter } from './SharedSiteSections';

const courses = [
  { title: 'Smart Investing Fundamentals', subtitle: "Beginner's Guide to Stock Market", duration: '15 modules', level: 'Beginner', video: 'course-investing.mp4', description: 'Build a strong investing foundation—from how markets work and opening a Demat account to portfolio building, risk and live market practice.', modules: ['Introduction to the Stock Market', 'How the Stock Market Works', 'Stock Market Participants', 'Demat & Trading Account', 'Financial Instruments', 'Understanding Stocks & Prices', 'Fundamental & Technical Basics', 'Order Types', 'Risk Management', 'Long-Term Investing', 'Beginner Mistakes', 'Live Market Demonstration', 'Build Your First Portfolio'] },
  { title: 'Mutual Fund Wealth Builder', subtitle: 'Smart Mutual Fund Investing', duration: '10–15 hours', level: 'Beginner to intermediate', video: 'course-mutual-funds.mp4', description: 'Learn to compare fund categories, understand returns and risk, plan SIPs, manage taxes, and create a long-term, goal-led mutual fund portfolio.', modules: ['Introduction to Mutual Funds', 'Industry Participants', 'Types of Mutual Funds', 'Fund Documents', 'NAV & Returns', 'Risk & Performance Analysis', 'Choosing the Right Fund', 'SIP, STP & SWP', 'Taxation', 'Investment Process', 'Portfolio Construction', 'Mistakes to Avoid', 'Live Fund Analysis', 'Advanced Strategies'] },
  { title: 'Technical Analysis Blueprint', subtitle: 'Professional Technical Trading', duration: '20–25 hours', level: 'Beginner to advanced', video: 'course-technical-analysis.mp4', description: 'Read charts with confidence. Move from chart fundamentals to candlesticks, price action, indicators, trade planning, and live market analysis.', modules: ['Introduction to Technical Analysis', 'Understanding Price Charts', 'Candlestick Analysis', 'Trend Analysis', 'Support & Resistance', 'Trendlines & Chart Patterns', 'Volume Analysis', 'Moving Averages', 'Momentum Indicators', 'Volatility Indicators', 'Fibonacci Analysis', 'Price Action Trading', 'Trading Strategies', 'Risk & Trade Management', 'Multi-Timeframe Analysis', 'Live Market Analysis'] },
  { title: 'Professional Options Trading', subtitle: 'Advanced Options Strategies', duration: '25–30 hours', level: 'Beginner to advanced', video: 'course-options.mp4', description: 'Understand options from first principles through Greeks, volatility, strategy selection, hedging, disciplined execution, and trade management.', modules: ['Options Market Basics', 'Option Chain & Pricing', 'Option Greeks', 'Buying Options', 'Option Selling', 'Single-Leg Strategies', 'Multi-Leg Strategies', 'Volatility-Based Trading', 'Options Risk Management', 'Trading Psychology', 'Technical Analysis for Options', 'Live Options Workflow', 'Advanced Options Strategies'] },
  { title: 'Value Investing Blueprint', subtitle: 'Equity Research & Fundamental Analysis', duration: '20–25 hours', level: 'Beginner to advanced', video: 'course-value-investing.mp4', description: 'Learn how investors evaluate businesses: financial statements, ratios, valuation, quality, industry context, and portfolio construction.', modules: ['Introduction to Fundamental Analysis', 'Businesses & Industries', 'Financial Statements', 'Income Statement Analysis', 'Balance Sheet Analysis', 'Cash Flow Analysis', 'Financial Ratios', 'Valuation Techniques', 'Qualitative Analysis', 'Annual Report Analysis', 'Economic & Industry Analysis', 'Stock Screening', 'Portfolio Construction', 'Live Company Analysis'] },
  { title: 'Professional Equity Research Analyst Program', subtitle: 'Research Analyst Career Accelerator', duration: '40–50 hours', level: 'Intermediate to advanced', video: 'course-equity-research.mp4', description: 'A career-focused program covering research workflow, modelling, valuation, report writing, compliance, ethics and analyst career preparation.', modules: ['Introduction to Equity Research', 'Financial Markets', 'Business & Industry Analysis', 'Financial Statement Analysis', 'Ratio Analysis', 'Company Valuation', 'Financial Modeling', 'Research Report Writing', 'Technical Analysis', 'Economic & Macro Analysis', 'SEBI RA Regulations', 'Registration Process', 'Ethics & Standards', 'Research Tools', 'Practical Equity Research'] },
  { title: 'NISM XV Research Analyst Exam Prep', subtitle: 'NISM XV Exam Success Program', duration: '35–45 hours', level: 'Intermediate', video: 'course-nism.mp4', description: 'Prepare systematically for the NISM-Series-XV exam with complete syllabus coverage, practical cases, mock tests and exam-focused revision.', modules: ['Research Analyst Profession', 'Securities Market', 'Financial Statement Analysis', 'Ratio Analysis', 'Company & Industry Analysis', 'Equity Valuation', 'Investment Decision Making', 'Economics & Macro Analysis', 'Technical Analysis', 'Research Report Writing', 'Legal & Regulatory Framework', 'Excel for Analysts', 'Mock Tests & Case Studies'] },
];

const courseSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function CoursesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const targets = [...document.querySelectorAll('.course-shell h1 > strong, .course-shell h1 > span, .course-shell h2 > strong, .course-shell h2 > span')];
    const sections = new Map();
    const timers = new Map();
    targets.forEach((target) => {
      const section = target.closest('section');
      if (!section) return;
      target.dataset.typewriterText = target.textContent.trim();
      target.setAttribute('aria-label', target.dataset.typewriterText);
      if (!sections.has(section)) sections.set(section, { targets: [], visible: false });
      sections.get(section).targets.push(target);
    });
    const schedule = (target, callback, delay) => {
      const timer = window.setTimeout(callback, delay);
      timers.set(target, [...(timers.get(target) ?? []), timer]);
    };
    const resetTarget = (target) => {
      (timers.get(target) ?? []).forEach(window.clearTimeout);
      timers.set(target, []);
      target.classList.remove('is-typewriting');
      target.textContent = target.dataset.typewriterText;
    };
    const runTypewriter = (target, speed = 34) => {
      const value = target.dataset.typewriterText;
      let index = 0;
      target.textContent = '';
      target.classList.add('is-typewriting');
      const typeNext = () => {
        if (!target.dataset.typewriterActive) return;
        target.textContent = value.slice(0, (index += 1));
        if (index < value.length) schedule(target, typeNext, speed);
        else schedule(target, reverseNext, 3300);
      };
      const reverseNext = () => {
        if (!target.dataset.typewriterActive) return;
        index -= 1;
        target.textContent = value.slice(0, Math.max(0, index));
        if (index > 0) schedule(target, reverseNext, 13);
        else schedule(target, () => runTypewriter(target, speed), 180);
      };
      schedule(target, typeNext, 80);
    };
    const refreshTypewriters = () => {
      sections.forEach((state, section) => {
        const bounds = section.getBoundingClientRect();
        const visible = bounds.top < window.innerHeight * 0.82 && bounds.bottom > window.innerHeight * 0.12;
        if (visible && !state.visible) state.targets.forEach((target, index) => {
          resetTarget(target);
          target.dataset.typewriterActive = 'true';
          schedule(target, () => runTypewriter(target), index * 190);
        });
        if (!visible && state.visible) state.targets.forEach((target) => {
          delete target.dataset.typewriterActive;
          resetTarget(target);
        });
        state.visible = visible;
      });
    };
    window.addEventListener('scroll', refreshTypewriters, { passive: true });
    window.addEventListener('resize', refreshTypewriters);
    window.requestAnimationFrame(refreshTypewriters);
    return () => {
      window.removeEventListener('scroll', refreshTypewriters);
      window.removeEventListener('resize', refreshTypewriters);
      targets.forEach((target) => {
        delete target.dataset.typewriterActive;
        resetTarget(target);
      });
    };
  }, []);

  return <main className="course-shell">
    <div className="site-topbar course-topbar"><div className="topbar-inner"><div className="topbar-contact"><a href="mailto:support@smishasharemarket.com"><i className="fa-regular fa-envelope" />support@smishasharemarket.com</a><a href="tel:+917420001687"><i className="fa-solid fa-phone" />+91 7420001687</a></div><div className="topbar-socials" aria-label="Social media links"><a href="#contact" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a><a href="#contact" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a><a href="#contact" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp" /></a></div></div></div>
    <header className="site-header course-header"><a className="brand" href="/" aria-label="Smisha home"><img className="brand-logo" src="/assets/smisha-logo.png" alt="Smisha Share Market Classes" /><span className="brand-name">SMISHA <small>SHARE MARKET</small></span></a><nav className={`desktop-nav course-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation"><a href="/">Homepage</a><a href="/#about">About Us</a><a className="active" href="/courses">Courses</a><a href="/#services">Programs</a><a href="/#contact">Contact Us</a></nav><div className="header-actions"><a className="appointment" href="#contact">Book a<br />demo</a><button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu" aria-expanded={menuOpen}><span /><span /></button></div></header>
    <section className="course-hero" aria-labelledby="courses-title"><div className="course-hero-ring ring-one" /><div className="course-hero-ring ring-two" /><div className="course-hero-grid" /><div className="course-hero-content"><p className="course-kicker"><i className="fa-solid fa-sparkles" /> Curated learning paths</p><h1 id="courses-title"><span>Find the market path</span><br /><strong>built for your ambition.</strong></h1><p className="course-hero-copy">Practical market education designed around real decisions—not theory alone. Start with confidence, then grow your edge.</p><div className="course-hero-actions"><a className="course-primary-button" href="#course-list">Explore courses <i className="fa-solid fa-arrow-down" /></a><a className="course-text-link" href="#how-it-works">How learning works <i className="fa-solid fa-arrow-right" /></a></div></div><aside className="course-hero-proof"><div className="proof-top"><span>SMISHA ACADEMY</span><i className="fa-solid fa-arrow-trend-up" /></div><strong>7</strong><p>practical paths for investors, traders &amp; aspiring analysts</p><div className="proof-pills"><span>Live practice</span><span>Career-ready</span></div></aside></section>
    <section className="course-intro" id="course-list" aria-labelledby="course-list-heading"><div><p className="section-label">OUR COURSE LIBRARY</p><h2 id="course-list-heading"><span>Learn the skills that make </span><strong>every decision clearer.</strong></h2></div><p>Choose a focused starting point or build your capability across investing, trading, research and certification.</p></section>
    <section className="course-grid" aria-label="Courses">{courses.map((course, index) => <article className="course-card" key={course.title}><div className="course-media"><video src={`/assets/courses/${course.video}`} muted loop autoPlay playsInline preload="metadata" /><span className="course-number">0{index + 1}</span><span className="course-level">{course.level}</span></div><div className="course-card-content"><p className="course-subtitle">{course.subtitle}</p><h3>{course.title}</h3><p className="course-description">{course.description}</p><div className="course-meta"><span><i className="fa-regular fa-clock" /> {course.duration}</span><span><i className="fa-solid fa-layer-group" /> {course.modules.length} modules</span></div><a className="course-details-button" href={`/courses/${courseSlug(course.title)}`}>View curriculum <i className="fa-solid fa-arrow-up-right-from-square" /></a></div></article>)}</section>
    <section className="course-method" id="how-it-works"><div><p className="section-label">THE SMISHA DIFFERENCE</p><h2><span>Study it. </span><strong>See it live.</strong><span> Put it to work.</span></h2></div><div className="method-points"><p><b>01</b> Structured concepts, explained in clear language.</p><p><b>02</b> Practical examples that connect learning to the market.</p><p><b>03</b> A guided path to build calm, repeatable decision-making.</p></div></section>
    <section className="course-cta" id="course-advice"><p>NOT SURE WHERE TO START?</p><h2><span>Let’s find the right</span><br /><strong>learning path for you.</strong></h2><a href="mailto:support@smishasharemarket.com">Talk to our team <i className="fa-solid fa-arrow-right" /></a></section>
    <SiteFAQ />
    <SiteFooter />
    {selectedCourse && <div className="curriculum-dialog" role="dialog" aria-modal="true" aria-labelledby="curriculum-title" onClick={() => setSelectedCourse(null)}><div className="curriculum-panel" onClick={(event) => event.stopPropagation()}><button className="dialog-close" type="button" onClick={() => setSelectedCourse(null)} aria-label="Close curriculum"><i className="fa-solid fa-xmark" /></button><p className="section-label">COURSE CURRICULUM</p><p className="dialog-subtitle">{selectedCourse.subtitle}</p><h2 id="curriculum-title">{selectedCourse.title}</h2><p className="dialog-description">{selectedCourse.description}</p><div className="dialog-stats"><span><i className="fa-regular fa-clock" /> {selectedCourse.duration}</span><span><i className="fa-solid fa-signal" /> {selectedCourse.level}</span></div><ol className="module-list">{selectedCourse.modules.map((module, index) => <li key={module}><span>{String(index + 1).padStart(2, '0')}</span>{module}</li>)}</ol><a className="course-primary-button dialog-cta" href="mailto:support@smishasharemarket.com">Enquire about this course <i className="fa-solid fa-arrow-right" /></a></div></div>}
  </main>;
}
