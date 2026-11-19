'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { landingMarkup } from './landing-markup';
import SiteHeader from './SiteHeader';
import AcademyMap from './AcademyMap';
import HomeCourseCarousel from './HomeCourseCarousel';
import HomeHeroVideoBackground from './HomeHeroVideoBackground';
import HomeSplitHero from './HomeSplitHero';
import SplitText from './SplitText';
import AcademyAccordionGallery from './AcademyAccordionGallery';
import IndiaMapTestimonials from './IndiaMapTestimonials';

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
    mountIsland('.home-hero-video-mount', <HomeHeroVideoBackground />, true);
    mountIsland('.home-split-hero-mount', <HomeSplitHero />, true);
    mountIsland('.home-courses-slot', <HomeCourseCarousel />);
    mountIsland('.academy-gallery-slot', <AcademyAccordionGallery />);
    mountIsland('.india-testimonials-slot', <IndiaMapTestimonials />, false, true);
    mountIsland('#stories-title', <>
      <strong><SplitText text="Real students." className="stories-title-text" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></strong>
      <span className="stories-title-accent"><SplitText text="Stronger market decisions." className="stories-title-text" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></span>
    </>);

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
        <SplitText key={`gallery-second-${cycle}`} text="stronger market decisions." className="academy-gallery-title-line academy-gallery-title-accent" delay={22} duration={0.62} effect="rise" splitType="words, chars" staggerFrom="start" mask={false} />
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
        <SplitText text="Grow with discipline." className="market-growth-heading-line market-growth-heading-accent" delay={22} duration={0.62} effect="rise" splitType="words, chars" staggerFrom="start" mask={false} trigger="view" threshold={0.1} rootMargin="-100px" />
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

    // A restrained, scroll-linked depth effect only for the homepage courses section.
    // Transform the heading and viewport (not the carousel track), so navigation
    // and card interactions retain their existing horizontal scrolling behavior.
    const servicesSection = select('#services.services-section');
    if (servicesSection && 'IntersectionObserver' in window) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const desktopMotion = window.matchMedia('(min-width: 768px)');
      let inView = false;
      let frame = 0;
      const updateServicesParallax = () => {
        frame = 0;
        if (!inView || reducedMotion.matches || !desktopMotion.matches) return;
        const rect = servicesSection.getBoundingClientRect();
        const travel = (window.innerHeight + rect.height) / 2;
        const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
        const progress = Math.max(-1, Math.min(1, -distanceFromCenter / travel));
        servicesSection.style.setProperty('--services-parallax-progress', progress.toFixed(4));
      };
      const scheduleServicesParallax = () => {
        if (inView && !frame) frame = window.requestAnimationFrame(updateServicesParallax);
      };
      const resetServicesParallax = () => {
        if (reducedMotion.matches || !desktopMotion.matches) {
          servicesSection.style.setProperty('--services-parallax-progress', '0');
        } else scheduleServicesParallax();
      };
      const observer = new IntersectionObserver((entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (inView) scheduleServicesParallax();
      }, { rootMargin: '120px 0px' });
      observer.observe(servicesSection);
      window.addEventListener('scroll', scheduleServicesParallax, { passive: true });
      window.addEventListener('resize', resetServicesParallax, { passive: true });
      reducedMotion.addEventListener('change', resetServicesParallax);
      desktopMotion.addEventListener('change', resetServicesParallax);
      cleanups.push(() => {
        observer.disconnect();
        window.removeEventListener('scroll', scheduleServicesParallax);
        window.removeEventListener('resize', resetServicesParallax);
        reducedMotion.removeEventListener('change', resetServicesParallax);
        desktopMotion.removeEventListener('change', resetServicesParallax);
        window.cancelAnimationFrame(frame);
        servicesSection.style.removeProperty('--services-parallax-progress');
      });
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

    if (track && storyViewport && !motionQuery.matches) {
      track.style.transform = 'none';
      track.style.transition = 'none';
      const easeOutQuint = (progress) => 1 - ((1 - progress) ** 5);
      const animateStoryScroll = (destination, smooth, onComplete) => {
        window.cancelAnimationFrame(slideAnimation);
        if (!smooth) {
          storyViewport.scrollLeft = destination;
          onComplete?.();
          return;
        }
        const start = storyViewport.scrollLeft;
        const distance = destination - start;
        const duration = 680;
        const startedAt = window.performance.now();
        storyViewport.classList.add('is-autoplaying');
        const step = (now) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          storyViewport.scrollLeft = start + distance * easeOutQuint(progress);
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
