'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { landingMarkup } from './landing-markup';
import SiteHeader from './SiteHeader';
import GhostFibers from './GhostFibers';
import MarketCandles from './MarketCandles';
import HomeCourseCarousel from './HomeCourseCarousel';
import AcademyAccordionGallery from './AcademyAccordionGallery';
import EventGallery from './EventGallery';
import IndiaMapTestimonials from './IndiaMapTestimonials';
import TradingViewTickerTape from './TradingViewTickerTape';

const GHOST_FIBERS_PROPS = {
  lineColor: '#3b82e8', glowColor: '#61c8ff', backdropColor: '#dcefff', speed: 0.2, scale: 2, rotation: 0,
  rotationSpeed: 0.25, layers: 4, waveAmplitude: 0.015, waveFrequency: 3, waveSpeed: 0.15,
  layerSpeed: 0.08, twist: 0.1, twistFrequency: 5, twistSpeed: 1.2, lineFrequency: 5,
  lineSpacing: 2, lineSharpness: 16, glowFalloff: 10, glowIntensity: 0.72, brightness: 0.9,
  blueBoost: 1.08, vignette: 0.34, grain: 0.025, dpr: 1, lightMode: false, fps: 60, paused: false,
};

export default function LandingPage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const select = (selector) => root.querySelector(selector);
    const selectAll = (selector) => [...root.querySelectorAll(selector)];
    const cleanups = [];

    const fibersSlot = select('.hero-fibers-slot');
    if (fibersSlot) {
      const fibersRoot = createRoot(fibersSlot);
      fibersRoot.render(<GhostFibers className="hero-fibers-canvas" {...GHOST_FIBERS_PROPS} />);
      cleanups.push(() => fibersRoot.unmount());
    }

    const marketCandlesSlot = select('.market-candles-slot');
    if (marketCandlesSlot) {
      const marketCandlesRoot = createRoot(marketCandlesSlot);
      marketCandlesRoot.render(<MarketCandles className="market-candles-canvas" />);
      cleanups.push(() => marketCandlesRoot.unmount());
    }

    const courseCarouselSlot = select('.home-courses-slot');
    if (courseCarouselSlot) {
      const courseCarouselRoot = createRoot(courseCarouselSlot);
      courseCarouselRoot.render(<HomeCourseCarousel />);
      cleanups.push(() => courseCarouselRoot.unmount());
    }

    const academyGallerySlot = select('.academy-gallery-slot');
    if (academyGallerySlot) {
      const academyGalleryRoot = createRoot(academyGallerySlot);
      academyGalleryRoot.render(<AcademyAccordionGallery />);
      cleanups.push(() => academyGalleryRoot.unmount());
    }

    const eventGallerySlot = select('.event-gallery-slot');
    if (eventGallerySlot) {
      const eventGalleryRoot = createRoot(eventGallerySlot);
      eventGalleryRoot.render(<EventGallery />);
      cleanups.push(() => eventGalleryRoot.unmount());
    }

    const indiaTestimonialsSlot = select('.india-testimonials-slot');
    if (indiaTestimonialsSlot) {
      const indiaTestimonialsRoot = createRoot(indiaTestimonialsSlot);
      indiaTestimonialsRoot.render(<IndiaMapTestimonials />);
      cleanups.push(() => indiaTestimonialsRoot.unmount());
    }

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

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const storyViewport = select('.stories-viewport');
    const track = select('[data-carousel-track]');
    if (track && storyViewport && !motionQuery.matches) {
      const slides = [...track.children];
      const dots = selectAll('.story-progress span');
      let index = 0;

      // Use the viewport's native scrolling instead of translating a cloned
      // slide. The old clone/reset cycle could leave this section between
      // slides, which looked like an empty student-stories panel.
      track.style.transform = 'none';
      track.style.transition = 'none';
      let slideAnimation = 0;
      const easeOutQuint = (progress) => 1 - ((1 - progress) ** 5);
      const animateStoryScroll = (destination, smooth) => {
        window.cancelAnimationFrame(slideAnimation);
        if (!smooth || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          storyViewport.scrollLeft = destination;
          return;
        }
        const start = storyViewport.scrollLeft;
        const distance = destination - start;
        const duration = 760;
        const startedAt = window.performance.now();
        const step = (now) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          storyViewport.scrollLeft = start + distance * easeOutQuint(progress);
          if (progress < 1) slideAnimation = window.requestAnimationFrame(step);
        };
        slideAnimation = window.requestAnimationFrame(step);
      };
      const showSlide = (nextIndex, smooth = true) => {
        const slide = slides[nextIndex];
        if (!slide) return;
        index = nextIndex;
        animateStoryScroll(slide.offsetLeft - track.offsetLeft, smooth);
        dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
      };
      const onResize = () => showSlide(index, false);
      const interval = window.setInterval(() => showSlide((index + 1) % slides.length), 5600);

      showSlide(0, false);
      window.addEventListener('resize', onResize);
      cleanups.push(() => {
        window.clearInterval(interval);
        window.cancelAnimationFrame(slideAnimation);
        window.removeEventListener('resize', onResize);
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <><TradingViewTickerTape /><SiteHeader active="Homepage" demoHref="#contact" /><div ref={rootRef} dangerouslySetInnerHTML={{ __html: landingMarkup }} /></>;
}
