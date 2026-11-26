'use client';

import { Component, lazy, Suspense, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { indiaFallback, landingMarkup } from './landing-markup';
import SiteHeader from './SiteHeader';
import './AcademyMap.css';
import HomeCourseCarousel from './HomeCourseCarousel';
import HomeSplitHero from './HomeSplitHero';
import SplitText from './SplitText';
import AcademyAccordionGallery from './AcademyAccordionGallery';
import FinalDemoForm from './FinalDemoForm';
import MarketGrowthChart from './MarketGrowthChart';
const IndiaMapTestimonials = lazy(() => import('./IndiaMapTestimonials'));
const Grainient = lazy(() => import('./Grainient'));

class IslandBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
const indiaBackup = <div dangerouslySetInnerHTML={{ __html: indiaFallback }} />;

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
        const mounts = lazyIslands.get(entry.target);
        if (mounts) { lazyIslands.delete(entry.target); islandObserver.unobserve(entry.target); mounts.forEach(mount => mount()); }
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
      else { const anchor = observeSlot ? slot : (slot.parentElement || slot); const mounts = lazyIslands.get(anchor) || []; mounts.push(mount); lazyIslands.set(anchor, mounts); islandObserver.observe(anchor); }
      cleanups.push(() => mountedRoot?.unmount());
    };
    mountIsland('.home-split-hero-mount', <HomeSplitHero />, true);
    mountIsland('.market-growth-chart', <MarketGrowthChart upColor="#168758" downColor="#D84545" />, false, true);
    mountIsland('.home-courses-slot', <HomeCourseCarousel />, true);
    mountIsland('.academy-gallery-slot', <AcademyAccordionGallery />, true);
    mountIsland('.india-testimonials-slot', <IslandBoundary fallback={indiaBackup}><Suspense fallback={indiaBackup}><IndiaMapTestimonials /></Suspense></IslandBoundary>, true);
    mountIsland('.final-demo-grainient-slot', <Suspense fallback={null}><Grainient className="final-demo-grainient" color1="#f8fcfb" color2="#dcefeb" color3="#ecf7f4" colors={['#f8fcfb', '#e7f4f1', '#dcefeb', '#ecf7f4', '#f8fcfb']} flow={0.65} speed={0.35} silk={0.12} grainAmount={0.018} contrast={1} saturation={0.8} interactive={false} clickSwirl={false} intro={false} dpr={1} /></Suspense>);
    mountIsland('.final-demo-candles', <MarketGrowthChart />, false, true);
    // Mount the conversion form immediately so the visible CTA is interactive
    // even when the visitor jumps directly to this section via an anchor.
    const finalDemoSlot = select('.final-demo-content-slot');
    if (finalDemoSlot) {
      const finalDemoRoot = createRoot(finalDemoSlot);
      const openFallback = (event) => {
        if (!event.target.closest?.('[data-open-conversation]')) return;
        event.preventDefault();
        finalDemoRoot.render(<FinalDemoForm initialOpen />);
      };
      finalDemoSlot.addEventListener('click', openFallback);
      finalDemoRoot.render(<FinalDemoForm />);
      cleanups.push(() => {
        finalDemoSlot.removeEventListener('click', openFallback);
        finalDemoRoot.unmount();
      });
    }
    mountIsland('#stories-title', <>
      <strong><SplitText text="Real students." className="stories-title-text" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></strong>
      <span className="stories-title-accent"><SplitText text="Stronger market decisions." highlightWords="1" className="stories-title-text" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></span>
    </>);
    mountIsland('#faq-title', <>
      <strong><SplitText text="Your questions," className="faq-title-text" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></strong>
      <span className="faq-title-accent"><SplitText text="answered with clarity." highlightWords="1,2" className="faq-title-text" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></span>
    </>);
    mountIsland('#credibility-title', <>
      <span><SplitText text="Enroll with confidence," className="credibility-title-text" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></span>
      <strong><SplitText text="in five simple steps." highlightWords="1" className="credibility-title-text" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></strong>
    </>);

    // The satellite iframe loads with the initial page. Reveal its floating
    // invitation separately so it never delays loading the underlying map.
    const locationCard = select('.home-location-section .home-map-overlay');
    if (locationCard && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const locationObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        locationCard.classList.add('is-location-visible');
        locationObserver.disconnect();
      }, { threshold: 0.1 });
      if (locationCard.getBoundingClientRect().bottom > 0) {
        locationCard.classList.add('location-reveal-ready');
        locationObserver.observe(locationCard);
      }
      cleanups.push(() => {
        locationObserver.disconnect();
        locationCard.classList.remove('location-reveal-ready', 'is-location-visible');
      });
    }

    // Reveal content as it enters view, including islands mounted later. Leave
    // the growth section and course cards to their existing motion systems.
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const revealGroups = [
        ['.feature-card', 80],
        ['.home-courses-carousel .services-heading .section-kicker, .home-courses-carousel .services-subheading, .home-courses-carousel .services-actions', 80],
        ['.academy-gallery-heading > div, .academy-gallery-heading > p, .academy-gallery-slot', 100],
        ['.credibility-heading, .credibility-intro, .credibility-proof', 100],
        ['.enrollment-step', 70],
        ['.stories-header, .stories-viewport, .story-carousel-controls', 100],
        ['.india-testimonials-heading .section-kicker, .india-testimonials-heading > p:not(.section-kicker)', 100],
        ['.faq-heading, .faq-item, .faq-help-card', 75],
        ['.home-location-section .home-map-overlay > *', 85],
        ['.final-demo-card, .final-demo-partners', 100],
        ['.site-footer .footer-contact-strip > p, .site-footer .footer-contact-strip > a, .site-footer .footer-brand, .site-footer .footer-links, .site-footer .footer-newsletter, .site-footer .footer-bottom', 75],
      ];
      const revealSelector = revealGroups.map(([selector]) => selector).join(', ');
      const seen = new WeakSet();
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.remove('home-reveal-pending');
          target.classList.add('home-reveal-visible');
          revealObserver.unobserve(target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
      const scanReveals = (scope = root) => {
        revealGroups.forEach(([selector, step]) => {
          const matches = [...(scope.matches?.(selector) ? [scope] : []), ...scope.querySelectorAll(selector)];
          matches.forEach((element, index) => {
            if (seen.has(element)) return;
            seen.add(element);
            // Do not hide content already passed on an anchor jump or refresh.
            if (element.getBoundingClientRect().bottom <= 0) return;
            element.style.setProperty('--home-reveal-delay', `${Math.min(index % 5 * step, 300)}ms`);
            element.classList.add('home-reveal-pending');
            revealObserver.observe(element);
          });
        });
      };
      let scanFrame = 0;
      const pendingNodes = new Set();
      const mutations = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node.nodeType === 1 && (node.matches(revealSelector) || node.querySelector(revealSelector))) pendingNodes.add(node);
        }));
        if (pendingNodes.size && !scanFrame) scanFrame = window.requestAnimationFrame(() => {
          scanFrame = 0;
          pendingNodes.forEach(node => { if (node.isConnected) scanReveals(node); });
          pendingNodes.clear();
        });
      });
      scanReveals();
      mutations.observe(root, { childList: true, subtree: true });
      cleanups.push(() => {
        mutations.disconnect();
        revealObserver.disconnect();
        window.cancelAnimationFrame(scanFrame);
        selectAll('.home-reveal-pending, .home-reveal-visible').forEach(element => {
          element.classList.remove('home-reveal-pending', 'home-reveal-visible');
          element.style.removeProperty('--home-reveal-delay');
        });
      });
    }

    const academyGallery = select('.academy-gallery-section');
    const academyGalleryTitle = select('#academy-gallery-title');
    let academyGalleryTitleRoot = null;
    let galleryObserver = null;
    let galleryTitleCycle = 0;
    let galleryWasVisible = false;
    const renderAcademyGalleryTitle = () => {
      if (!academyGalleryTitle) return;
      if (!academyGalleryTitleRoot) academyGalleryTitleRoot = createRoot(academyGalleryTitle);
      const cycle = galleryTitleCycle;
      academyGalleryTitleRoot.render(<>
        <SplitText key={`gallery-first-${cycle}`} text="See the work behind" className="academy-gallery-title-line" delay={22} duration={0.62} effect="rise" splitType="words, chars" staggerFrom="start" mask={false} />
        <SplitText key={`gallery-second-${cycle}`} text="stronger market decisions." highlightWords="1" className="academy-gallery-title-line academy-gallery-title-accent" delay={22} duration={0.62} effect="rise" splitType="words, chars" staggerFrom="start" mask={false} />
      </>);
    };
    const observeAcademyGallery = () => {
      if (!academyGallery || !academyGalleryTitle) return;
      if (!('IntersectionObserver' in window)) {
        renderAcademyGalleryTitle();
        return;
      }
      galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target !== academyGallery) return;
          academyGallery.classList.toggle('is-visible', entry.isIntersecting);
          if (entry.isIntersecting && !galleryWasVisible) {
            galleryWasVisible = true;
            galleryTitleCycle += 1;
            renderAcademyGalleryTitle();
          } else if (!entry.isIntersecting) {
            galleryWasVisible = false;
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
      galleryObserver.observe(academyGallery);
    };
    const galleryLoaderFinished = window.__SMISHA_LOADER_COMPLETE__ || !document.querySelector('.smisha-loader');
    if (galleryLoaderFinished) observeAcademyGallery();
    else window.addEventListener('smisha-loader-complete', observeAcademyGallery, { once: true });
    cleanups.push(() => {
      window.removeEventListener('smisha-loader-complete', observeAcademyGallery);
      galleryObserver?.disconnect();
      academyGalleryTitleRoot?.unmount();
    });

    const growthSection = select('.market-growth-section');
    const growthTitle = select('#market-growth-title');
    let growthTitleRoot = null;
    let growthObserver = null;
    const mountGrowthTitle = () => {
      if (!growthTitle || growthTitleRoot) return;
      growthTitleRoot = createRoot(growthTitle);
      growthTitleRoot.render(<>
        <SplitText text="Learn with confidence." className="market-growth-heading-line" delay={22} duration={0.62} effect="rise" splitType="words, chars" staggerFrom="start" mask={false} trigger="view" threshold={0.1} rootMargin="-100px" />
        <SplitText text="Grow with discipline." highlightWords="1,2" className="market-growth-heading-line market-growth-heading-accent" delay={22} duration={0.62} effect="rise" splitType="words, chars" staggerFrom="start" mask={false} trigger="view" threshold={0.1} rootMargin="-100px" />
      </>);
    };
    const growthMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (growthSection) {
      const observeGrowthSection = () => {
        if (growthMotion.matches || !('IntersectionObserver' in window)) {
          mountGrowthTitle();
          return;
        }
        growthSection.classList.add('market-growth-motion-ready');
        growthObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.target !== growthSection) return;
            growthSection.classList.toggle('is-visible', entry.isIntersecting);
            if (entry.isIntersecting) mountGrowthTitle();
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
        growthObserver.observe(growthSection);
      };
      const loaderFinished = window.__SMISHA_LOADER_COMPLETE__ || !document.querySelector('.smisha-loader');
      if (loaderFinished) observeGrowthSection();
      else window.addEventListener('smisha-loader-complete', observeGrowthSection, { once: true });
      cleanups.push(() => {
        window.removeEventListener('smisha-loader-complete', observeGrowthSection);
        growthObserver?.disconnect();
      });
      cleanups.push(() => growthTitleRoot?.unmount());
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
    const faqAnimations = new Map();
    const faqDesired = new Map(faqItems.map((item) => [item, item.open]));
    const animateFaq = (item, shouldOpen) => {
      const summary = item.querySelector('summary');
      if (!summary || faqDesired.get(item) === shouldOpen) return;
      faqDesired.set(item, shouldOpen);
      const startHeight = item.getBoundingClientRect().height;
      faqAnimations.get(item)?.cancel();
      faqAnimations.delete(item);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !item.animate) {
        item.open = shouldOpen;
        return;
      }
      if (shouldOpen) item.open = true;
      const borderHeight = item.offsetHeight - item.clientHeight;
      const targetHeight = (shouldOpen ? item.scrollHeight : summary.getBoundingClientRect().height) + borderHeight;
      const animation = item.animate(
        [{ height: `${startHeight}px` }, { height: `${targetHeight}px` }],
        { duration: 380, easing: 'cubic-bezier(.22, 1, .36, 1)' },
      );
      faqAnimations.set(item, animation);
      animation.onfinish = () => {
        item.open = shouldOpen;
        faqAnimations.delete(item);
      };
    };
    faqItems.forEach((item) => {
      const summary = item.querySelector('summary');
      const toggleFaq = (event) => {
        event.preventDefault();
        const shouldOpen = !faqDesired.get(item);
        faqItems.forEach((other) => { if (other !== item) animateFaq(other, false); });
        animateFaq(item, shouldOpen);
      };
      summary?.addEventListener('click', toggleFaq);
      cleanups.push(() => summary?.removeEventListener('click', toggleFaq));
    });
    cleanups.push(() => faqAnimations.forEach((animation) => animation.cancel()));

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const storyViewport = select('.stories-viewport');
    const track = select('[data-carousel-track]');
    const slides = track ? [...track.children] : [];
    const dots = selectAll('.story-progress span');
    const phoneStoryQuery = window.matchMedia('(max-width: 640px)');
    let index = 0;
    let slideAnimation = 0;
    let lastStoryInteraction = -Infinity;
    let storyLoopClone = null;
    let storyLoopBeforeClone = null;
    const storyOffset = (slide) => {
      if (!slide || !track || !storyViewport) return 0;
      const gutter = window.innerWidth <= 1024
        ? window.innerWidth * .08
        : Math.min(250, Math.max(24, window.innerWidth * .13));
      return Math.max(0, slide.offsetLeft - track.offsetLeft - gutter);
    };

    if (storyViewport && slides.length) {
      storyLoopBeforeClone = slides[slides.length - 1].cloneNode(true);
      storyLoopBeforeClone.dataset.storyClone = 'before';
      storyLoopBeforeClone.setAttribute('aria-hidden', 'true');
      storyLoopBeforeClone.inert = true;
      track.prepend(storyLoopBeforeClone);
      storyLoopClone = slides[0].cloneNode(true);
      storyLoopClone.dataset.storyClone = 'true';
      storyLoopClone.setAttribute('aria-hidden', 'true');
      storyLoopClone.inert = true;
      track.append(storyLoopClone);

      const syncStory = () => {
        // Programmatic animation already tracks the active slide. Measuring every
        // slide during each animation frame forces unnecessary layout work.
        if (storyViewport.classList.contains('is-autoplaying')) return;
        const viewportRect = storyViewport.getBoundingClientRect();
        const phoneView = phoneStoryQuery.matches;
        const anchor = phoneView ? viewportRect.left + viewportRect.width / 2 : viewportRect.left + storyViewport.clientLeft;
        const candidates = [storyLoopBeforeClone, ...slides, storyLoopClone];
        const closestIndex = candidates.reduce((closest, slide, slideIndex) => {
          const rect = slide.getBoundingClientRect();
          const point = phoneView ? rect.left + rect.width / 2 : rect.left;
          const distance = Math.abs(point - anchor);
          return distance < closest.distance ? { index: slideIndex, distance } : closest;
        }, { index: 0, distance: Infinity }).index;
        if (!storyViewport.classList.contains('is-autoplaying') && (closestIndex === 0 || closestIndex > slides.length)) {
          const destination = closestIndex === 0 ? slides[slides.length - 1] : slides[0];
          storyViewport.scrollLeft = storyOffset(destination);
        }
        index = closestIndex === 0 ? slides.length - 1 : closestIndex > slides.length ? 0 : closestIndex - 1;
        dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
      };
      const onStoryPointerDown = () => {
        lastStoryInteraction = window.performance.now();
        window.cancelAnimationFrame(slideAnimation);
        storyViewport.classList.remove('is-autoplaying');
      };
      storyViewport.addEventListener('scroll', syncStory, { passive: true });
      storyViewport.addEventListener('pointerdown', onStoryPointerDown, { passive: true });
      storyViewport.addEventListener('wheel', onStoryPointerDown, { passive: true });
      cleanups.push(() => {
        storyViewport.removeEventListener('scroll', syncStory);
        storyViewport.removeEventListener('pointerdown', onStoryPointerDown);
        storyViewport.removeEventListener('wheel', onStoryPointerDown);
        storyLoopClone?.remove();
        storyLoopBeforeClone?.remove();
      });
    }

    if (track && storyViewport && slides.length) {
      track.style.transform = 'none';
      track.style.transition = 'none';
      const easeInOutCubic = (progress) => progress < .5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2;
      const animateStoryScroll = (destination, smooth, onComplete) => {
        window.cancelAnimationFrame(slideAnimation);
        if (!smooth || motionQuery.matches) {
          storyViewport.scrollLeft = destination;
          onComplete?.();
          return;
        }
        const start = storyViewport.scrollLeft;
        const distance = destination - start;
        const duration = 750;
        const startedAt = window.performance.now();
        storyViewport.classList.add('is-autoplaying');
        const step = (now) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          storyViewport.scrollLeft = start + distance * easeInOutCubic(progress);
          if (progress < 1) slideAnimation = window.requestAnimationFrame(step);
          else {
            onComplete?.();
            storyViewport.classList.remove('is-autoplaying');
          }
        };
        slideAnimation = window.requestAnimationFrame(step);
      };
      const showSlide = (nextIndex, smooth = true) => {
        const wrappingForward = nextIndex >= slides.length;
        const wrappingBackward = nextIndex < 0;
        const wrapping = wrappingForward || wrappingBackward;
        const destinationIndex = wrappingForward ? 0 : wrappingBackward ? slides.length - 1 : nextIndex;
        const slide = wrappingForward ? storyLoopClone : wrappingBackward ? storyLoopBeforeClone : slides[destinationIndex];
        if (!slide) return;
        index = destinationIndex;
        dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
        animateStoryScroll(storyOffset(slide), smooth, wrapping ? () => {
          storyViewport.scrollLeft = storyOffset(slides[destinationIndex]);
          dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === destinationIndex));
        } : undefined);
      };
      const previousButton = select('[data-story-prev]');
      const nextButton = select('[data-story-next]');
      const navigateStory = (direction) => {
        lastStoryInteraction = window.performance.now();
        window.cancelAnimationFrame(slideAnimation);
        storyViewport.classList.remove('is-autoplaying');
        showSlide(index + direction);
      };
      const onPreviousStory = () => navigateStory(-1);
      const onNextStory = () => navigateStory(1);
      previousButton?.addEventListener('click', onPreviousStory);
      nextButton?.addEventListener('click', onNextStory);
      cleanups.push(() => {
        previousButton?.removeEventListener('click', onPreviousStory);
        nextButton?.removeEventListener('click', onNextStory);
      });
      const onResize = () => showSlide(index, false);
      const interval = window.setInterval(() => {
        if (motionQuery.matches || document.hidden) return;
        const rect = storyViewport.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        if (window.performance.now() - lastStoryInteraction < 7000) return;
        showSlide(index + 1);
      }, 5600);

      showSlide(0, false);
      window.addEventListener('resize', onResize);
      cleanups.push(() => {
        window.clearInterval(interval);
        window.cancelAnimationFrame(slideAnimation);
        storyViewport.classList.remove('is-autoplaying');
        window.removeEventListener('resize', onResize);
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <div className="landing-page"><SiteHeader active="Homepage" demoHref="#contact" homePattern /><div ref={rootRef} dangerouslySetInnerHTML={{ __html: landingMarkup }} /></div>;
}
