'use client';

import { useEffect, useRef, useState } from 'react';
import SplitText from './SplitText';

const slides = [
  {
    image: '/assets/home-hero/business-news.webp',
    number: '01.',
    label: 'Live Classes',
    description: 'Learn directly from live market sessions and real chart discussions.',
    href: '/courses',
    alt: 'A person reading the business section of a newspaper',
  },
  {
    image: '/assets/home-hero/market-quotes.webp',
    number: '02.',
    label: 'Mentorship',
    description: 'Get guided support to build stronger market decisions.',
    href: '/about',
    alt: 'Stock market prices and charts displayed on a tablet',
  },
  {
    image: '/assets/home-hero/buy-sell.webp',
    number: '03.',
    label: 'Workshops',
    description: 'Build perspective through practical sessions with market educators.',
    href: '/workshops',
    alt: 'A hand holding cards marked buy and sell',
  },
  {
    image: '/assets/home-hero/trading-workspace.webp',
    number: '04.',
    label: 'Market Skills',
    description: 'Explore practical tools for understanding and analysing the markets.',
    href: '/courses',
    alt: 'Trading charts and a calculator on a desk',
  },
];

const textSlides = [
  {
    heading: ['Learn markets.', 'Trade with clarity.'],
    description: 'Live market classes, expert mentorship, and risk-first training for decisions you can stand behind.',
  },
  {
    heading: ['Build confidence.', 'Trade with discipline.'],
    description: 'Practical guidance and clear frameworks to help you make calmer, better-informed market decisions.',
  },
  {
    heading: ['Learn by doing.', 'Invest with purpose.'],
    description: 'Turn market concepts into a repeatable process with hands-on classes and experienced support.',
  },
];

const socialLinks = [
  ['Facebook', 'fa-facebook-f', 'https://www.facebook.com/SmishaShareMarketClasses'],
  ['Instagram', 'fa-instagram', 'https://www.instagram.com/smisha_share_market'],
  ['YouTube', 'fa-youtube', 'https://www.youtube.com/@smishasharemarket'],
  ['LinkedIn', 'fa-linkedin-in', 'https://in.linkedin.com/company/smishasharemarket'],
];

export default function HomeSplitHero() {
  const [active, setActive] = useState(0);
  const [activeText, setActiveText] = useState(0);
  const [textPhase, setTextPhase] = useState('visible');
  const [introReady, setIntroReady] = useState(false);
  const textTransitionFrame = useRef();
  const slide = slides[active];
  const textSlide = textSlides[activeText];

  useEffect(() => {
    const start = () => setIntroReady(true);
    window.addEventListener('smisha-loader-complete', start, { once: true });
    if (window.__SMISHA_LOADER_COMPLETE__ || !document.querySelector('.smisha-loader')) start();
    const safeguard = window.setTimeout(start, 5000);
    return () => { window.removeEventListener('smisha-loader-complete', start); window.clearTimeout(safeguard); };
  }, []);

  useEffect(() => {
    if (!introReady || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    // Leave enough time for the photo's slow zoom cycle to feel intentional.
    const timer = window.setTimeout(() => setActive(index => (index + 1) % slides.length), 6800);
    return () => window.clearTimeout(timer);
  }, [introReady, active]);

  useEffect(() => {
    if (!introReady || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let hideTimer;
    let revealTimer;
    const timer = window.setInterval(() => {
      setTextPhase('leaving');
      hideTimer = window.setTimeout(() => setTextPhase('hidden'), 500);
      revealTimer = window.setTimeout(() => {
        setActiveText(index => (index + 1) % textSlides.length);
        setTextPhase('entering');
        textTransitionFrame.current = window.requestAnimationFrame(() => setTextPhase('visible'));
      }, 1050);
    }, 6500);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(revealTimer);
      window.cancelAnimationFrame(textTransitionFrame.current);
    };
  }, [introReady]);

  const choose = (direction) => setActive(index => (index + direction + slides.length) % slides.length);

  return (
    <section className={`home-split-hero ${introReady ? 'home-split-hero--intro-ready' : 'home-split-hero--intro-waiting'}`} aria-labelledby="home-split-title">
      <div className="home-split-video-panel">
        <video className="home-split-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src="/assets/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="home-split-video-wash" aria-hidden="true" />
        <div className={`home-split-copy home-split-copy--${textPhase}`}>
          <p className="home-split-kicker">Pune&apos;s share market academy</p>
          <h1 id="home-split-title">
            {introReady ? <SplitText
              text={textSlide.heading[0]}
              className="home-split-heading-line"
              delay={22}
              duration={0.62}
              effect="rise"
              splitType="words, chars"
              staggerFrom="start"
              mask={false}
            /> : <span className="home-split-heading-line">{textSlide.heading[0]}</span>}
            {introReady ? <SplitText
              text={textSlide.heading[1]}
              highlightWords="1,2"
              className="home-split-heading-line home-split-heading-accent"
              delay={22}
              duration={0.62}
              effect="rise"
              splitType="words, chars"
              staggerFrom="start"
              mask={false}
            /> : <span className="home-split-heading-line home-split-heading-accent">{textSlide.heading[1].split(' ')[0]} <em className="heading-gold">{textSlide.heading[1].split(' ').slice(1).join(' ')}</em></span>}
          </h1>
          <p>{textSlide.description}</p>
          <a className="home-split-cta" href="/contact" aria-label="Book a free consultation"><span className="glass-button-label" aria-hidden="true"><span>Book a free consultation</span><span>Let’s talk about your goals</span></span><i className="fa-solid fa-arrow-right" aria-hidden="true" /></a>
        </div>
        <div className="home-split-socials" aria-label="Follow Smisha Share Market">
          {socialLinks.map(([name, icon, href]) => <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}><i className={`fa-brands ${icon}`} aria-hidden="true" /><span>{name}</span></a>)}
        </div>
        <div className="home-split-info-card" aria-live="polite">
          <span className="home-split-info-number">{slide.number}</span>
          <strong className="home-split-info-title">{slide.label}</strong>
          <p>{slide.description}</p>
        </div>
      </div>
      <div className="home-split-gallery-panel">
        {slides.map((item, index) => <img
          key={item.image}
          className={`home-split-gallery-image home-split-gallery-image--${index}${index === active ? ` is-active${introReady ? ' is-zooming' : ''}` : ''}`}
          src={item.image}
          alt={index === active ? item.alt : ''}
          aria-hidden={index !== active}
          fetchPriority={index === 0 ? 'high' : 'low'}
        />)}
        <div className="home-split-gallery-wash" aria-hidden="true" />
        <div className="home-split-gallery-dots" role="group" aria-label="Choose a market image">
          {slides.map((item, index) => <button key={item.image} type="button" className={index === active ? 'is-active' : ''} aria-label={`Show ${item.label} image`} aria-pressed={index === active} onClick={() => setActive(index)} />)}
        </div>
        <div className="home-split-gallery-controls">
          <button type="button" onClick={() => choose(-1)} aria-label="Show previous market image"><i className="fa-solid fa-arrow-left" aria-hidden="true" /></button>
          <button type="button" onClick={() => choose(1)} aria-label="Show next market image"><i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
        </div>
        <a className="home-split-read-more" href={slide.href}>Read More <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a>
      </div>
    </section>
  );
}
