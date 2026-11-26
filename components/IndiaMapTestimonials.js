'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SplitText from './SplitText';
import mapArtwork from '../lib/india-map-artwork.json';

import { learnerLocations } from '../lib/learner-locations';

const CARD_ZONES = ['left-upper', 'right-upper', 'left-mid', 'right-mid', 'left-lower', 'right-lower', 'left-far', 'right-far', 'left-bottom', 'right-bottom'];
const { width: MAP_WIDTH, height: MAP_HEIGHT, states: paths } = mapArtwork;
function projectLocation(longitude, latitude) {
  const { minX, minY, scale, offsetX, offsetY } = mapArtwork.projection;
  const x = longitude * Math.PI / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360));
  return [offsetX + (x - minX) * scale, MAP_HEIGHT - offsetY - (y - minY) * scale];
}

function GoogleReviewCard({ location, zone, active }) {
  return <article className={`india-review-card india-review-card--${zone} india-review-card--${location.size}${active ? ' is-active' : ''}`}>
    <div className="india-review-card-head">
      <span className="india-google-brand">Reviews</span>
    </div>
    <div className="india-review-stars" aria-label={`${location.rating} out of 5 star rating`}>
      {Array.from({ length: 5 }, (_, index) => <i className={`fa-${index < location.rating ? 'solid' : 'regular'} fa-star`} key={index} aria-hidden="true" />)}
    </div>
    <div className="india-review-profile"><img src={location.avatar} alt="" loading="lazy" decoding="async" /><div><strong>{location.studentName}</strong><small>{location.city}, {location.state}</small></div></div>
    <p>{location.reviewText}</p>
  </article>;
}

export default function IndiaMapTestimonials() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Keep a bounded set of visible cards while allowing the rotation to visit
  // every supplied review, even when there are more reviews than card zones.
  const [cards, setCards] = useState(() => learnerLocations.slice(0, CARD_ZONES.length).map((_, index) => ({ index, zone: CARD_ZONES[index] })));
  const [visited, setVisited] = useState(() => learnerLocations.slice(0, CARD_ZONES.length).map((_, index) => index));
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [cardLimit, setCardLimit] = useState(10);
  const active = learnerLocations[activeIndex];

  const activate = useCallback((requestedIndex) => {
    const index = (requestedIndex + learnerLocations.length) % learnerLocations.length;
    setActiveIndex(index);
    setVisited((current) => current.includes(index) ? current : [...current, index]);
    setCards((current) => {
      const existing = current.find((card) => card.index === index);
      if (existing) return [...current.filter((card) => card.index !== index), existing];
      const removed = current.length === CARD_ZONES.length ? current[0] : null;
      return [...(removed ? current.slice(1) : current), { index, zone: removed?.zone || CARD_ZONES[current.length] }];
    });
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduceMotion(media.matches);
    update(); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update);
  }, []);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const update = () => setCardLimit(window.innerWidth <= 620 ? 1 : window.innerWidth <= 1060 ? 4 : 10);
    update(); window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 }); observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!inView || reduceMotion || paused || !pageVisible) return undefined;
    const delay = visited.length < learnerLocations.length ? 850 : 2200;
    const timer = window.setTimeout(() => activate(activeIndex + 1), delay);
    return () => window.clearTimeout(timer);
  }, [activeIndex, activate, inView, reduceMotion, paused, pageVisible, visited.length]);

  const visibleCards = useMemo(() => {
    if (cardLimit === 1) return [{ index: activeIndex, zone: 'mobile-active' }];
    return cards.slice(-cardLimit);
  }, [activeIndex, cardLimit, cards]);

  return <section className={`india-testimonials-section${inView ? ' is-visible' : ''}`} ref={sectionRef} aria-labelledby="india-testimonials-title">
    <div className="india-market-texture" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
    <div className="india-testimonials-inner">
      <header className="india-testimonials-heading"><p className="section-kicker">STUDENTS ACROSS INDIA</p><h2 id="india-testimonials-title"><SplitText text="Trusted Across India" highlightWords="1" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></h2><p>Sample reviews shown for design preview; replace with verified learner feedback before publishing.</p></header>
      <div className="india-review-map-layout">
        <div className="india-map-panel" aria-label="India map showing student review locations"><div className="india-map-glow" aria-hidden="true" />
          <svg className="india-state-map india-state-map--refined" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="group" aria-label="India map with interactive student review locations">
            <defs><linearGradient id="india-map-surface" gradientUnits="userSpaceOnUse" x1="130" y1="60" x2="480" y2="650"><stop offset="0%" stopColor="#347d77" /><stop offset="55%" stopColor="#205953" /><stop offset="100%" stopColor="#123c39" /></linearGradient></defs>
            <g className="india-map-ocean-labels" aria-hidden="true"><text x="78" y="455" transform="rotate(-18 78 455)">ARABIAN SEA</text><text x="470" y="475">BAY OF BENGAL</text></g>
            <path className="india-map-silhouette" d={mapArtwork.outline} fillRule="evenodd" aria-hidden="true" />
            <g className="india-state-paths">{paths.map((path) => <path key={path.id} className={`${path.id === active.stateId ? 'is-active' : ''}${path.id === 'IN-LD' ? ' is-maritime' : ''}`} d={path.d} fillRule="evenodd"><title>{path.name}{path.id === 'IN-LD' ? ' ? administrative waters' : ''}</title></path>)}</g>
            <g className="india-map-markers">{learnerLocations.map((location, index) => {
              const [x, y] = projectLocation(location.longitude, location.latitude);
              const isActive = index === activeIndex;
              return <g className={`india-map-marker${isActive ? ' is-active' : ''}`} key={location.id} role="button" tabIndex={0} aria-label={`Show ${location.studentName}'s ${location.city} review`} aria-pressed={isActive} onClick={() => activate(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(index); } }}><title>{location.city}, {location.state}</title><circle className="india-marker-hit" cx={x} cy={y} r="19" />{isActive && <circle className="india-marker-pulse" cx={x} cy={y} r="18" />}<circle className="india-marker-ring" cx={x} cy={y} r={isActive ? 11 : 7} /><circle className="india-marker-core" cx={x} cy={y} r={isActive ? 5 : 3.5} /></g>;
            })}</g>
            {(() => {
              const [x, y] = projectLocation(active.longitude, active.latitude);
              const width = Math.max(100, active.city.length * 8 + 30);
              return <g className="india-active-city" transform={`translate(${Math.min(x + 20, MAP_WIDTH - width - 10)} ${y - 42})`} aria-hidden="true"><rect width={width} height="31" rx="8" /><text x={width / 2} y="20">{active.city}</text></g>;
            })()}
          </svg>
        </div>
        {visibleCards.map((card) => <GoogleReviewCard key={learnerLocations[card.index].id} location={learnerLocations[card.index]} zone={card.zone} active={card.index === activeIndex} />)}
      </div>
      {!reduceMotion && <button className="india-reviews-playback" type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}><i className={`fa-solid fa-${paused ? 'play' : 'pause'}`} aria-hidden="true" /> {paused ? 'Resume reviews' : 'Pause reviews'}</button>}
      <a className="india-map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Map data &copy; OpenStreetMap contributors</a>
    </div>
  </section>;
}
