'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { landingMarkup } from './landing-markup';
import SiteHeader from './SiteHeader';
import AcademyMap from './AcademyMap';
import GhostFibers from './GhostFibers';
import MarketCandles from './MarketCandles';
import HomeCourseCarousel from './HomeCourseCarousel';
import AcademyAccordionGallery from './AcademyAccordionGallery';
import EventGallery from './EventGallery';
import IndiaMapTestimonials from './IndiaMapTestimonials';

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

    // Preserve every component and animation, but initialize below-fold React
    // islands only as visitors approach them rather than all on page load.
    const lazyIslands = new Map();
    const islandObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const mount = lazyIslands.get(entry.target);
        if (mount) { lazyIslands.delete(entry.target); islandObserver.unobserve(entry.target); mount(); }
      });
    }, { rootMargin: '650px 0px' }) : null;
    cleanups.push(() => islandObserver?.disconnect());
    const mountIsland = (selector, view, immediate = false, observeSlot = false) => {
      const slot = select(selector);
      if (!slot) return;
      let mountedRoot = null;
      const mount = () => {
        if (mountedRoot || !slot.isConnected) return;
        mountedRoot = createRoot(slot);
        mountedRoot.render(view);
      };
      if (immediate || !islandObserver) mount();
      else { const anchor = observeSlot ? slot : (slot.parentElement || slot); lazyIslands.set(anchor, mount); islandObserver.observe(anchor); }
      cleanups.push(() => mountedRoot?.unmount());
    };
    mountIsland('.academy-map-slot', <AcademyMap />);
    mountIsland('.hero-fibers-slot', <GhostFibers className="hero-fibers-canvas" {...GHOST_FIBERS_PROPS} />, true);
    mountIsland('.market-candles-slot', <MarketCandles className="market-candles-canvas" />);
    mountIsland('.home-courses-slot', <HomeCourseCarousel />);
    mountIsland('.academy-gallery-slot', <AcademyAccordionGallery />);
    mountIsland('.event-gallery-slot', <EventGallery />);
    mountIsland('.india-testimonials-slot', <IndiaMapTestimonials />, false, true);

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
    const slides = track ? [...track.children] : [];
    const dots = selectAll('.story-progress span');
    const phoneStoryQuery = window.matchMedia('(max-width: 640px)');
    let index = 0;
    let slideAnimation = 0;
    let lastStoryInteraction = -Infinity;

    if (storyViewport && slides.length) {
      const syncPhoneStory = () => {
        if (!phoneStoryQuery.matches) return;
        const viewportRect = storyViewport.getBoundingClientRect();
        const center = viewportRect.left + viewportRect.width / 2;
        index = slides.reduce((closest, slide, slideIndex) => {
          const rect = slide.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - center);
          return distance < closest.distance ? { index: slideIndex, distance } : closest;
        }, { index: 0, distance: Infinity }).index;
        dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
      };
      const onStoryPointerDown = () => {
        if (!phoneStoryQuery.matches) return;
        lastStoryInteraction = window.performance.now();
        window.cancelAnimationFrame(slideAnimation);
      };
      storyViewport.addEventListener('scroll', syncPhoneStory, { passive: true });
      storyViewport.addEventListener('pointerdown', onStoryPointerDown, { passive: true });
      cleanups.push(() => {
        storyViewport.removeEventListener('scroll', syncPhoneStory);
        storyViewport.removeEventListener('pointerdown', onStoryPointerDown);
      });
    }

    if (track && storyViewport && !motionQuery.matches) {
      // Use the viewport's native scrolling instead of translating a cloned
      // slide. The old clone/reset cycle could leave this section between
      // slides, which looked like an empty student-stories panel.
      track.style.transform = 'none';
      track.style.transition = 'none';
      const easeOutQuint = (progress) => 1 - ((1 - progress) ** 5);
      const animateStoryScroll = (destination, smooth) => {
        window.cancelAnimationFrame(slideAnimation);
        if (!smooth || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          storyViewport.scrollLeft = destination;
          return;
        }
        if (phoneStoryQuery.matches) {
          storyViewport.scrollTo({ left: destination, behavior: 'smooth' });
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
      const interval = window.setInterval(() => {
        if (phoneStoryQuery.matches && window.performance.now() - lastStoryInteraction < 5600) return;
        showSlide((index + 1) % slides.length);
      }, 5600);

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

  return <div className="landing-page"><SiteHeader active="Homepage" demoHref="#contact" /><div ref={rootRef} dangerouslySetInnerHTML={{ __html: landingMarkup }} /></div>;
}
