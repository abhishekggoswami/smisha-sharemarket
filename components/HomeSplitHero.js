'use client';

import { useEffect, useRef, useState } from 'react';
import SplitText from './SplitText';

const slides = [
  {
    image: '/assets/event-gallery/event-stage-portrait.jpg',
    number: '01.',
    label: 'Live Classes',
    description: 'Learn directly from live market sessions and real chart discussions.',
    href: '/courses',
    alt: 'Sushil Kamboj presenting at a stock market event stage',
  },
  {
    image: '/assets/event-gallery/event-stage-audience.jpg',
    number: '02.',
    label: 'Mentorship',
    description: 'Get guided support to build stronger market decisions.',
    href: '/about',
    alt: 'A stock market session in front of a live audience',
  },
  {
    image: '/assets/event-gallery/event-auditorium.jpg',
    number: '03.',
    label: 'Workshops',
    description: 'Build perspective through practical sessions with market educators.',
    href: '/workshops',
    alt: 'Learners attending a financial education event',
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
  const textTransitionFrame = useRef();
  const slide = slides[active];
  const textSlide = textSlides[activeText];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    // Leave enough time for the photo's slow zoom cycle to feel intentional.
    const timer = window.setInterval(() => setActive(index => (index + 1) % slides.length), 8500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

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
  }, []);

  const choose = (direction) => setActive(index => (index + direction + slides.length) % slides.length);

  return (
    <section className="home-split-hero" aria-labelledby="home-split-title">
      <div className="home-split-video-panel">
        <video className="home-split-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src="/assets/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="home-split-video-wash" aria-hidden="true" />
        <div className={`home-split-copy home-split-copy--${textPhase}`}>
          <p className="home-split-kicker">Pune&apos;s share market academy</p>
          <h1 id="home-split-title">
            <SplitText
              text={textSlide.heading[0]}
              className="home-split-heading-line"
              delay={22}
              duration={0.62}
              effect="rise"
              splitType="words, chars"
              staggerFrom="start"
              mask={false}
            />
            <SplitText
              text={textSlide.heading[1]}
              className="home-split-heading-line home-split-heading-accent"
              delay={22}
              duration={0.62}
              effect="rise"
              splitType="words, chars"
              staggerFrom="start"
              mask={false}
            />
          </h1>
          <p>{textSlide.description}</p>
          <a className="home-split-cta" href="/contact">Book a free consultation <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a>
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
        <img key={slide.image} className={`home-split-gallery-image home-split-gallery-image--${active}`} src={slide.image} alt={slide.alt} fetchPriority="high" />
        <div className="home-split-gallery-wash" aria-hidden="true" />
        <div className="home-split-gallery-dots" role="group" aria-label="Choose a workshop photo">
          {slides.map((item, index) => <button key={item.image} type="button" className={index === active ? 'is-active' : ''} aria-label={`Show ${item.label} photo`} aria-pressed={index === active} onClick={() => setActive(index)} />)}
        </div>
        <div className="home-split-gallery-controls">
          <button type="button" onClick={() => choose(-1)} aria-label="Show previous workshop photo"><i className="fa-solid fa-arrow-left" aria-hidden="true" /></button>
          <button type="button" onClick={() => choose(1)} aria-label="Show next workshop photo"><i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
        </div>
        <a className="home-split-read-more" href={slide.href}>Read More <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a>
      </div>
    </section>
  );
}
