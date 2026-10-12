'use client';

import { useEffect, useRef, useState } from 'react';
import './AcademyMap.css';

const satelliteSource = zoom => `https://maps.google.com/maps?q=18.5564578%2C73.955024&t=k&z=${zoom}&output=embed`;

export default function AcademyMap({ className = '' }) {
  const rootRef = useRef(null);
  const [requested, setRequested] = useState(false);
  const active = requested;
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: '600px' });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = rootRef.current?.closest('section');
    if (!section) return;
    const activate = () => setRequested(true);
    section.addEventListener('click', activate, true);
    return () => {
      section.removeEventListener('click', activate, true);
    };
  }, []);

  return <div ref={rootRef} className={`academy-map academy-map--satellite ${active ? 'is-focused' : ''} ${className}`} data-map-view={active ? 'close' : 'wide'} data-zoom-requested={requested} style={{ height: '100%', minHeight: 0, width: '100%' }}>
    <iframe className="academy-satellite-wide" src={satelliteSource(16)} title="Wider satellite view around Smisha Academy" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" tabIndex={-1} aria-hidden={active} />
    <iframe className="academy-satellite-close" src={nearViewport || active ? satelliteSource(18) : undefined} title="Satellite map of Smisha Share Market Academy in Pune" loading="eager" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen tabIndex={active ? 0 : -1} aria-hidden={!active} />
    {!active && <button type="button" className="academy-map-zoom-trigger" aria-label="Zoom satellite map to Smisha Academy" onClick={() => setRequested(true)}><span>Click to explore Smisha</span></button>}
  </div>;
}
