'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const galleryItems = [
  { image: '/assets/academy-gallery/academy-classroom-01.webp', label: 'Live learning in action', alt: 'Faculty member leading a full Smisha classroom session' },
  { image: '/assets/academy-gallery/academy-classroom-02.webp', label: 'Focused classroom sessions', alt: 'Students learning in an attentive classroom' },
  { image: '/assets/academy-gallery/academy-classroom-03.webp', label: 'Practice that feels real', alt: 'Students taking notes during a Smisha learning session' },
  { image: '/assets/academy-gallery/academy-office-01.webp', label: 'Support behind the scenes', alt: 'Smisha team working together in the academy office' },
  { image: '/assets/academy-gallery/academy-office-02.webp', label: 'Preparation in progress', alt: 'Smisha operations team at their workstations' },
  { image: '/assets/academy-gallery/academy-mentor-cabin-01.webp', label: 'Mentor-led market room', alt: 'Smisha mentor cabin with a market analysis screen' },
];

export default function AcademyAccordionGallery() {
  const galleryRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const [active, setActive] = useState(2);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.15 });
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener?.('change', updatePreference);
    return () => preference.removeEventListener?.('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!isInView || isHovered || isFocused || reducedMotion || !isPageVisible) return undefined;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % galleryItems.length);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [active, isInView, isHovered, isFocused, reducedMotion, isPageVisible]);

  useEffect(() => {
    const panels = panelRefs.current;
    const media = mediaRefs.current;

    panels.forEach((panel, index) => {
      if (!panel) return;
      const isActive = index === active;
      const offset = Math.max(-1.5, Math.min(1.5, active - index)) * 14;
      gsap.to(panel, {
        duration: reducedMotion ? 0 : 1.15,
        ease: 'power2.inOut',
        flexGrow: isActive ? 7.6 : 1,
        rotateY: isActive ? 0 : index < active ? 3.5 : -3.5,
        overwrite: true,
      });
      if (media[index]) {
        gsap.to(media[index], {
          duration: reducedMotion ? 0 : 1.15,
          ease: 'power2.inOut',
          filter: isActive ? 'grayscale(0) saturate(1)' : 'grayscale(.72) saturate(.75)',
          opacity: isActive ? 1 : .74,
          xPercent: -50,
          yPercent: -50,
          x: isActive ? 0 : offset,
          scale: isActive ? 1.035 : 1,
          overwrite: true,
        });
      }
    });
  }, [active, reducedMotion]);

  const moveFocus = (index, step) => {
    const next = (index + step + galleryItems.length) % galleryItems.length;
    setActive(next);
    panelRefs.current[next]?.focus();
  };

  return (
    <div
      ref={galleryRef}
      className="academy-accordion"
      role="list"
      aria-label="Inside Smisha Share Market Academy"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
      }}
    >
      {galleryItems.map((item, index) => (
        <button
          className={`academy-accordion-panel${index === active ? ' is-active' : ''}`}
          key={item.image}
          type="button"
          role="listitem"
          ref={(node) => { panelRefs.current[index] = node; }}
          aria-label={item.label}
          aria-pressed={index === active}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onClick={() => setActive(index)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveFocus(index, 1); }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveFocus(index, -1); }
          }}
        >
          <span className="academy-accordion-media" ref={(node) => { mediaRefs.current[index] = node; }}>
            <img decoding="async" src={item.image} alt={item.alt} loading={index > 1 ? 'lazy' : 'eager'} />
          </span>
          <span className="academy-accordion-shade" aria-hidden="true" />
          <span className="academy-accordion-caption"><i aria-hidden="true"></i><span>{item.label}</span></span>
        </button>
      ))}
    </div>
  );
}
