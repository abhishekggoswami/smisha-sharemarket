'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SplitText from './SplitText';

// Temporary presentation content. These fields are kept in one data source so
// approved review copy, dates, names and portraits can be swapped in cleanly.
export const learnerLocations = [
  { id: 'mumbai', studentName: 'Riya Sharma', city: 'Mumbai', state: 'Maharashtra', stateId: 'IN-MH', latitude: 19.076, longitude: 72.8777, rating: 5, relativeTime: '1 day ago', reviewText: 'The live sessions made market concepts much easier to understand. I now approach every trade with a clearer plan.', avatar: '/assets/students/student-4.jpeg', size: 'feature' },
  { id: 'ahmedabad', studentName: 'Aditya Shah', city: 'Ahmedabad', state: 'Gujarat', stateId: 'IN-GJ', latitude: 23.0225, longitude: 72.5714, rating: 5, relativeTime: '3 days ago', reviewText: 'The guidance feels structured, patient and focused on real market decisions.', avatar: '/assets/students/student-3.jpeg', size: 'standard' },
  { id: 'jaipur', studentName: 'Neha Jain', city: 'Jaipur', state: 'Rajasthan', stateId: 'IN-RJ', latitude: 26.9124, longitude: 75.7873, rating: 5, relativeTime: '4 days ago', reviewText: 'I appreciated how each topic connected to a practical trading routine.', avatar: '/assets/students/student-4-updated.jpeg', size: 'compact' },
  { id: 'new-delhi', studentName: 'Ananya Gupta', city: 'New Delhi', state: 'Delhi', stateId: 'IN-DL', latitude: 28.6139, longitude: 77.209, rating: 5, relativeTime: '5 days ago', reviewText: 'Clear explanations, useful sessions and a supportive learning experience throughout.', avatar: '/assets/students/review-woman-placeholder.webp', size: 'standard' },
  { id: 'chennai', studentName: 'Sneha Verma', city: 'Chennai', state: 'Tamil Nadu', stateId: 'IN-TN', latitude: 13.0827, longitude: 80.2707, rating: 5, relativeTime: '10 days ago', reviewText: 'Live learning and practical guidance made the course feel genuinely useful.', avatar: '/assets/students/student-2.jpeg', size: 'feature' },
  { id: 'kochi', studentName: 'Rohit Kulkarni', city: 'Kochi', state: 'Kerala', stateId: 'IN-KL', latitude: 9.9312, longitude: 76.2673, rating: 5, relativeTime: '2 days ago', reviewText: 'Practical examples and a disciplined learning path helped me build confidence step by step.', avatar: '/assets/students/testimonial-man.jpeg', size: 'compact' },
  { id: 'patna', studentName: 'Karan Patel', city: 'Patna', state: 'Bihar', stateId: 'IN-BR', latitude: 25.5941, longitude: 85.1376, rating: 5, relativeTime: '2 weeks ago', reviewText: 'The right mix of clarity, practice and market discipline for a learner.', avatar: '/assets/students/student-1.jpeg', size: 'standard' },
];

const CARD_ZONES = ['left-upper', 'right-upper', 'left-mid', 'right-mid', 'left-lower', 'right-lower', 'left-far', 'right-far', 'left-bottom', 'right-bottom'];
const MAP_WIDTH = 650;
const MAP_HEIGHT = 720;
const MAP_PADDING = 26;

function visitCoordinates(coordinates, callback) {
  if (!Array.isArray(coordinates)) return;
  if (typeof coordinates[0] === 'number') { callback(coordinates); return; }
  coordinates.forEach((item) => visitCoordinates(item, callback));
}

function projectMap(features) {
  let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
  features.forEach((feature) => visitCoordinates(feature.geometry.coordinates, ([x, y]) => {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }));
  const scale = Math.min((MAP_WIDTH - (MAP_PADDING * 2)) / (maxX - minX), (MAP_HEIGHT - (MAP_PADDING * 2)) / (maxY - minY));
  const offsetX = (MAP_WIDTH - ((maxX - minX) * scale)) / 2;
  const offsetY = (MAP_HEIGHT - ((maxY - minY) * scale)) / 2;
  return ([x, y]) => [offsetX + ((x - minX) * scale), MAP_HEIGHT - offsetY - ((y - minY) * scale)];
}

function toPath(feature, project) {
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  return polygons.map((polygon) => polygon.map((ring) => ring.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ') + 'Z').join(' ')).join(' ');
}

function GoogleReviewCard({ location, zone, active }) {
  return <article className={`india-review-card india-review-card--${zone} india-review-card--${location.size}${active ? ' is-active' : ''}`}>
    <div className="india-review-card-head">
      <span className="india-google-brand"><span className="india-google-mark"><img decoding="async" loading="lazy" src="/assets/google-reviews-logo.png" alt="Google" /></span><span>Google Reviews</span></span>
      <time>{location.relativeTime}</time>
    </div>
    <div className="india-review-stars" aria-label={`${location.rating} out of 5 star rating`}>
      {Array.from({ length: 5 }, (_, index) => <i className={`fa-${index < location.rating ? 'solid' : 'regular'} fa-star`} key={index} aria-hidden="true" />)}
    </div>
    <div className="india-review-profile"><img decoding="async" loading="lazy" src={location.avatar} alt="" /><div><strong>{location.studentName}</strong><small>{location.city}, {location.state}</small></div></div>
    <p>{location.reviewText}</p>
  </article>;
}

export default function IndiaMapTestimonials() {
  const sectionRef = useRef(null);
  const [features, setFeatures] = useState([]);
  const [mapError, setMapError] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cards, setCards] = useState([{ index: 0, zone: CARD_ZONES[0] }]);
  const [visited, setVisited] = useState([0]);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
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
    let current = true;
    setMapError(false);
    fetch('/assets/maps/india-states.geojson')
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!Array.isArray(data.features) || !data.features.length) throw new Error('Map data is unavailable');
        if (current) setFeatures(data.features);
      })
      .catch(() => { if (current) setMapError(true); });
    return () => { current = false; };
  }, [mapAttempt]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduceMotion(media.matches);
    update(); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update);
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
    if (!inView) return undefined;
    const timer = window.setTimeout(() => activate(activeIndex + 1), reduceMotion ? 1100 : 1550);
    return () => window.clearTimeout(timer);
  }, [activeIndex, activate, inView, reduceMotion]);

  const { projection, paths } = useMemo(() => {
    if (!features.length) return { projection: null, paths: [] };
    const mapProjection = projectMap(features);
    return { projection: mapProjection, paths: features.map((feature) => ({ id: feature.properties.code, name: feature.properties.name, d: toPath(feature, mapProjection) })) };
  }, [features]);
  const visibleCards = useMemo(() => {
    if (cardLimit === 1) return [{ index: activeIndex, zone: 'mobile-active' }];
    return cards.slice(-cardLimit);
  }, [activeIndex, cardLimit, cards]);

  return <section className={`india-testimonials-section${inView ? ' is-visible' : ''}`} ref={sectionRef} aria-labelledby="india-testimonials-title">
    <div className="india-market-texture" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
    <div className="india-testimonials-inner">
      <header className="india-testimonials-heading"><p className="section-kicker">STUDENTS ACROSS INDIA</p><h2 id="india-testimonials-title"><SplitText text="Trusted Across India" delay={22} duration={0.62} effect="rise" splitType="words, chars" mask={false} trigger="view" threshold={0.1} /></h2><p>Real learners from different cities sharing their experience with Smisha Share Market Academy.</p></header>
      <div className="india-review-map-layout">
        <div className="india-map-panel" aria-label="India map showing student review locations"><div className="india-map-glow" aria-hidden="true" />
          {paths.length ? <svg className="india-state-map" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label="Accurate map of India with state and union territory boundaries"><g className="india-state-paths">{paths.map((path) => <path key={path.id} className={path.id === active.stateId ? 'is-active' : ''} d={path.d} fillRule="evenodd"><title>{path.name}</title></path>)}</g><g className="india-map-markers">{projection && learnerLocations.map((location, index) => {
            if (!visited.includes(index)) return null;
            const [x, y] = projection([location.longitude, location.latitude]); const isActive = index === activeIndex;
            return <g className={`india-map-marker${isActive ? ' is-active' : ''}`} key={location.id} role="button" tabIndex={0} aria-label={`Show ${location.studentName}'s ${location.city} review`} aria-pressed={isActive} onClick={() => activate(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(index); } }}><title>{location.city}, {location.state}</title>{isActive && <circle className="india-marker-pulse" cx={x} cy={y} r="16" />}<circle className="india-marker-core" cx={x} cy={y} r={isActive ? 7.5 : 4.5} /></g>;
          })}</g></svg> : <div className="india-map-loading" aria-live="polite">{mapError ? <><span>India map could not be loaded.</span><button type="button" onClick={() => setMapAttempt((attempt) => attempt + 1)}>Try again</button></> : 'Loading India map…'}</div>}
          <a className="india-map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Map data © OpenStreetMap contributors</a>
        </div>
        {visibleCards.map((card) => <GoogleReviewCard key={learnerLocations[card.index].id} location={learnerLocations[card.index]} zone={card.zone} active={card.index === activeIndex} />)}
      </div>
    </div>
  </section>;
}
