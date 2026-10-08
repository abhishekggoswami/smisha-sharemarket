'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const galleryItems = [
  { image: '/assets/academy-gallery/academy-classroom-01.png', label: 'Live learning in action', alt: 'Faculty member leading a full Smisha classroom session' },
  { image: '/assets/academy-gallery/academy-classroom-02.png', label: 'Focused classroom sessions', alt: 'Students learning in an attentive classroom' },
  { image: '/assets/academy-gallery/academy-classroom-03.png', label: 'Practice that feels real', alt: 'Students taking notes during a Smisha learning session' },
  { image: '/assets/academy-gallery/academy-office-01.png', label: 'Support behind the scenes', alt: 'Smisha team working together in the academy office' },
  { image: '/assets/academy-gallery/academy-office-02.png', label: 'Preparation in progress', alt: 'Smisha operations team at their workstations' },
  { image: '/assets/academy-gallery/academy-mentor-cabin-01.png', label: 'Mentor-led market room', alt: 'Smisha mentor cabin with a market analysis screen' },
];

export default function AcademyAccordionGallery() {
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const [active, setActive] = useState(2);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panels = panelRefs.current;
    const media = mediaRefs.current;

    panels.forEach((panel, index) => {
      if (!panel) return;
      const isActive = index === active;
      const offset = Math.max(-1.5, Math.min(1.5, active - index)) * 14;
      gsap.to(panel, {
        duration: reduceMotion ? 0 : 0.62,
        ease: 'power3.out',
        flexGrow: isActive ? 7.6 : 1,
        rotateY: isActive ? 0 : index < active ? 3.5 : -3.5,
        overwrite: true,
      });
      if (media[index]) {
        gsap.to(media[index], {
          duration: reduceMotion ? 0 : 0.62,
          ease: 'power3.out',
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
  }, [active]);

  const moveFocus = (index, step) => {
    const next = (index + step + galleryItems.length) % galleryItems.length;
    setActive(next);
    panelRefs.current[next]?.focus();
  };

  return (
    <div className="academy-accordion" role="list" aria-label="Inside Smisha Share Market Academy">
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
            <img src={item.image} alt={item.alt} loading={index > 1 ? 'lazy' : 'eager'} />
          </span>
          <span className="academy-accordion-shade" aria-hidden="true" />
          <span className="academy-accordion-caption"><i aria-hidden="true"></i><span>{item.label}</span></span>
        </button>
      ))}
    </div>
  );
}
