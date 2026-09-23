'use client';

import { useEffect, useRef } from 'react';
import { landingMarkup } from './landing-markup';

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

    const typewriterTargets = selectAll('.partner-copy h2 > strong, .partner-copy h2 > span, .services-heading h2 > strong, .services-heading h2 > span, .stories-header h2 > strong, .stories-header h2 > span, .testimonials-heading h2 > strong, .testimonials-heading h2 > span, .process-heading h2 > strong, .process-heading h2 > span, .video-cta-content h2 > strong, .video-cta-content h2 > span, .faq-heading h2 > strong, .faq-heading h2 > span');
    if (typewriterTargets.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const sections = new Map();
      const timers = new Map();
      typewriterTargets.forEach((target) => {
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
      cleanups.push(() => {
        window.removeEventListener('scroll', refreshTypewriters);
        window.removeEventListener('resize', refreshTypewriters);
        typewriterTargets.forEach((target) => resetTarget(target));
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

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: landingMarkup }} />;
}
