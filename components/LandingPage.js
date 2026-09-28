'use client';

import { useEffect, useRef } from 'react';
import { landingMarkup } from './landing-markup';
import SiteHeader from './SiteHeader';

const ABOUT_CONTENT = {
  vision: { title: 'Our Vision', text: 'Practical learning, disciplined habits, and the confidence to make informed decisions.', image: "url('/assets/about-vision-event.png')", label: 'Smisha Share Market classroom event' },
  mission: { title: 'Our Mission', text: 'Clear market education, live exposure, and mentorship that turns knowledge into action.', image: "url('/assets/about-mission-event.png')", label: 'Smisha instructor leading a market session' },
  why: { title: 'Why Choose Smisha?', text: 'Real-world guidance, trading tools, and ongoing support built for market-ready traders.', image: "url('/assets/about-why-event.png')", label: 'Smisha Share Market student success event' },
};

export default function LandingPage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const select = (selector) => root.querySelector(selector);
    const selectAll = (selector) => [...root.querySelectorAll(selector)];
    const cleanups = [];

    const menuButton = select('.menu-button');
    const primaryNavigation = select('#primary-navigation');
    if (menuButton && primaryNavigation) {
      const closeMenu = () => {
        primaryNavigation.classList.remove('is-open');
        menuButton.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
      };
      const toggleMenu = () => {
        const isOpen = primaryNavigation.classList.toggle('is-open');
        menuButton.classList.toggle('is-open', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      };
      menuButton.addEventListener('click', toggleMenu);
      primaryNavigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
      window.addEventListener('resize', closeMenu);
      cleanups.push(() => {
        menuButton.removeEventListener('click', toggleMenu);
        primaryNavigation.querySelectorAll('a').forEach((link) => link.removeEventListener('click', closeMenu));
        window.removeEventListener('resize', closeMenu);
      });
    }

    const aboutVideo = select('.about-intro-video');
    const aboutVideoPlay = select('.story-video-play');
    const aboutVideoContainer = select('.story-video');
    if (aboutVideo && aboutVideoPlay && aboutVideoContainer) {
      const setPreviewFrame = () => {
        if (!aboutVideo.dataset.previewReady && Number.isFinite(aboutVideo.duration)) {
          aboutVideo.currentTime = Math.min(0.35, Math.max(0, aboutVideo.duration - 0.1));
          aboutVideo.dataset.previewReady = 'true';
        }
      };
      aboutVideo.addEventListener('loadeddata', setPreviewFrame, { once: true });
      if (aboutVideo.readyState >= 2) setPreviewFrame();
      const playVideo = async () => {
        aboutVideo.controls = true;
        aboutVideo.currentTime = 0;
        aboutVideoContainer.classList.add('is-playing');
        try { await aboutVideo.play(); } catch {
          aboutVideoContainer.classList.remove('is-playing');
          aboutVideo.controls = false;
        }
      };
      aboutVideoPlay.addEventListener('click', playVideo);
      cleanups.push(() => aboutVideoPlay.removeEventListener('click', playVideo));
    }

    const faqItems = selectAll('.faq-item');
    faqItems.forEach((item) => {
      const summary = item.querySelector('summary');
      const toggleFaq = (event) => {
        event.preventDefault();
        const shouldOpen = !item.open;
        faqItems.forEach((other) => { other.open = false; });
        item.open = shouldOpen;
      };
      summary?.addEventListener('click', toggleFaq);
      cleanups.push(() => summary?.removeEventListener('click', toggleFaq));
    });

    const typewriterHeadings = selectAll('.partner-copy h2, .stories-header h2, .testimonials-heading h2, .process-heading h2, .video-cta-content h2, .faq-heading h2');
    if (typewriterHeadings.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const sections = new Map();
      const timers = new Map();
      typewriterHeadings.forEach((heading) => {
        const lines = Array.from(heading.children).filter((child) => child.matches('strong, span'));
        const section = heading.closest('section');
        if (!lines.length) return;
        if (!section) return;
        lines.forEach((line) => { line.dataset.typewriterText = line.textContent.trim(); });
        heading.setAttribute('aria-label', lines.map((line) => line.dataset.typewriterText).join(' '));
        if (!sections.has(section)) sections.set(section, { headings: [], visible: false });
        sections.get(section).headings.push({ heading, lines });
      });
      const schedule = (entry, callback, delay) => {
        const timer = window.setTimeout(callback, delay);
        timers.set(entry, [...(timers.get(entry) ?? []), timer]);
      };
      const resetHeading = (entry) => {
        (timers.get(entry) ?? []).forEach(window.clearTimeout);
        timers.set(entry, []);
        entry.lines.forEach((line) => {
          line.classList.remove('is-typewriting');
          line.textContent = line.dataset.typewriterText;
        });
      };
      const runTypewriter = (entry, speed = 52) => {
        const { lines } = entry;
        let lineIndex = 0;
        let characterIndex = 0;
        lines.forEach((line) => { line.textContent = ''; line.classList.remove('is-typewriting'); });
        const setActiveLine = () => {
          lines.forEach((line, index) => line.classList.toggle('is-typewriting', index === lineIndex));
        };
        const typeNext = () => {
          if (!entry.heading.dataset.typewriterActive) return;
          const line = lines[lineIndex];
          const value = line.dataset.typewriterText;
          line.textContent = value.slice(0, (characterIndex += 1));
          if (characterIndex < value.length) schedule(entry, typeNext, speed);
          else if (lineIndex < lines.length - 1) schedule(entry, () => { line.classList.remove('is-typewriting'); lineIndex += 1; characterIndex = 0; setActiveLine(); typeNext(); }, 110);
          else schedule(entry, reverseNext, 3300);
        };
        const reverseNext = () => {
          if (!entry.heading.dataset.typewriterActive) return;
          const line = lines[lineIndex];
          characterIndex -= 1;
          line.textContent = line.dataset.typewriterText.slice(0, Math.max(0, characterIndex));
          if (characterIndex > 0) schedule(entry, reverseNext, 20);
          else if (lineIndex > 0) schedule(entry, () => { line.classList.remove('is-typewriting'); lineIndex -= 1; characterIndex = lines[lineIndex].dataset.typewriterText.length; setActiveLine(); reverseNext(); }, 80);
          else schedule(entry, () => runTypewriter(entry, speed), 180);
        };
        setActiveLine();
        schedule(entry, typeNext, 80);
      };
      const refreshTypewriters = () => {
        sections.forEach((state, section) => {
          const bounds = section.getBoundingClientRect();
          const visible = bounds.top < window.innerHeight * 0.82 && bounds.bottom > window.innerHeight * 0.12;
          if (visible && !state.visible) state.headings.forEach((entry, index) => {
            resetHeading(entry);
            entry.heading.dataset.typewriterActive = 'true';
            schedule(entry, () => runTypewriter(entry), index * 190);
          });
          if (!visible && state.visible) state.headings.forEach((entry) => {
            delete entry.heading.dataset.typewriterActive;
            resetHeading(entry);
          });
          state.visible = visible;
        });
      };
      window.addEventListener('scroll', refreshTypewriters, { passive: true });
      window.addEventListener('resize', refreshTypewriters);
      window.requestAnimationFrame(refreshTypewriters);
      cleanups.push(() => {
        window.removeEventListener('scroll', refreshTypewriters);
        window.removeEventListener('resize', refreshTypewriters);
        sections.forEach((state) => state.headings.forEach((entry) => resetHeading(entry)));
      });
    }

    const processSection = select('.process-section');
    const processSteps = selectAll('.process-step');
    if (processSection && processSteps.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          processSteps.forEach((step, index) => {
            step.style.animation = `process-step-in .6s ${index * 0.12}s cubic-bezier(.2,.8,.2,1) both`;
          });
          observer.disconnect();
        }
      }, { threshold: 0.2 });
      observer.observe(processSection);
      cleanups.push(() => observer.disconnect());
    }

    const aboutTabs = selectAll('[data-about-tab]');
    const aboutPanel = select('#about-panel');
    if (aboutTabs.length && aboutPanel) {
      const image = aboutPanel.querySelector('.vision-image');
      const title = aboutPanel.querySelector('h3');
      const text = aboutPanel.querySelector('p');
      const activateTab = (key) => {
        const content = ABOUT_CONTENT[key];
        if (!content) return;
        aboutTabs.forEach((tab) => {
          const active = tab.dataset.aboutTab === key;
          tab.classList.toggle('active', active);
          tab.setAttribute('aria-selected', String(active));
        });
        aboutPanel.classList.remove('is-changing');
        void aboutPanel.offsetWidth;
        title.textContent = content.title;
        text.textContent = content.text;
        image.style.backgroundImage = content.image;
        image.setAttribute('aria-label', content.label);
        aboutPanel.setAttribute('aria-labelledby', `about-tab-${key}`);
        aboutPanel.classList.add('is-changing');
      };
      aboutTabs.forEach((tab) => {
        const listener = () => activateTab(tab.dataset.aboutTab);
        tab.addEventListener('click', listener);
        cleanups.push(() => tab.removeEventListener('click', listener));
      });
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const track = select('[data-carousel-track]');
    if (track && !motionQuery.matches) {
      const originalSlides = [...track.children];
      const clone = originalSlides[0]?.cloneNode(true);
      if (clone) {
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
        const dots = selectAll('.story-progress span');
        let index = 0;
        const update = (animate = true) => {
          const width = originalSlides[0]?.getBoundingClientRect().width ?? 0;
          track.style.transition = animate ? 'transform 800ms cubic-bezier(.65, 0, .35, 1)' : 'none';
          track.style.transform = `translateX(-${index * (width + 32)}px)`;
          dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index % originalSlides.length));
        };
        const onResize = () => update(false);
        const onTransitionEnd = () => { if (index === originalSlides.length) { index = 0; update(false); } };
        window.addEventListener('resize', onResize);
        track.addEventListener('transitionend', onTransitionEnd);
        const interval = window.setInterval(() => { index += 1; update(true); }, 4600);
        cleanups.push(() => {
          window.clearInterval(interval);
          window.removeEventListener('resize', onResize);
          track.removeEventListener('transitionend', onTransitionEnd);
          clone.remove();
        });
      }
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <><SiteHeader active="Homepage" demoHref="#contact" /><div ref={rootRef} dangerouslySetInnerHTML={{ __html: landingMarkup }} /></>;
}
