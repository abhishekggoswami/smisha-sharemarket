'use client';

import { useEffect, useState } from 'react';

const eventImages = [
  {
    image: '/assets/event-gallery/event-speaker-focus.jpg',
    title: 'A point of view shaped by live markets',
    label: 'Market perspective',
    alt: 'Sushil Kamboj speaking at a stock market event',
  },
  {
    image: '/assets/event-gallery/event-stage-audience.jpg',
    title: 'Market conversations in full rooms',
    label: 'Live sessions',
    alt: 'Sushil Kamboj leading a stock market presentation before an audience',
  },
  {
    image: '/assets/event-gallery/event-auditorium.jpg',
    title: 'Ideas built for a room full of learners',
    label: 'Real audiences',
    alt: 'A full auditorium attending a stock market learning session',
  },
  {
    image: '/assets/event-gallery/event-guests.jpg',
    title: 'Learning alongside respected professionals',
    label: 'Industry community',
    alt: 'Guests and students attending a financial education event',
  },
  {
    image: '/assets/event-gallery/event-partnership.jpg',
    title: 'Growing through meaningful partnerships',
    label: 'Beyond the classroom',
    alt: 'Sushil Kamboj with a partner outside Indus Business School',
  },
  {
    image: '/assets/event-gallery/event-stage-portrait.jpg',
    title: 'The discipline behind every decision',
    label: 'On the stage',
    alt: 'Sushil Kamboj presenting at a stock market event stage',
  },
  {
    image: '/assets/event-gallery/event-speaker-stage.jpg',
    title: 'Turning market knowledge into clarity',
    label: 'Practical guidance',
    alt: 'Sushil Kamboj speaking at an educational stock market event',
  },
];

export default function EventGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = eventImages[activeIndex];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % eventImages.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="event-gallery-showcase">
      <article className="event-gallery-feature" aria-live="polite">
        <img src={active.image} alt={active.alt} fetchPriority="high" />
        <div className="event-gallery-feature-shade" aria-hidden="true" />
        <div className="event-gallery-feature-copy">
          <span>{active.label}</span>
          <strong>{active.title}</strong>
          <p>{String(activeIndex + 1).padStart(2, '0')} / {String(eventImages.length).padStart(2, '0')}</p>
        </div>
      </article>

      <div className="event-gallery-thumbnails" role="list" aria-label="Event gallery photos">
        {eventImages.map((item, index) => (
          <button
            key={item.image}
            className={`event-gallery-thumbnail${index === activeIndex ? ' is-active' : ''}`}
            type="button"
            role="listitem"
            aria-label={`Show ${item.label}: ${item.title}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            <img src={item.image} alt="" loading={index > 2 ? 'lazy' : 'eager'} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
