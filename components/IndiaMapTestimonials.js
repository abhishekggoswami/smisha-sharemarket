'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Temporary presentation content. These fields are kept in one data source so
// approved review copy, dates, names and portraits can be swapped in cleanly.
export const learnerLocations = [
  { id: 'mumbai', studentName: 'Riya Sharma', city: 'Mumbai', state: 'Maharashtra', stateId: 'IN-MH', latitude: 19.076, longitude: 72.8777, rating: 5, relativeTime: '1 day ago', reviewText: 'The live sessions made market concepts much easier to understand. I now approach every trade with a clearer plan.', avatar: '/assets/students/student-4.jpeg', size: 'feature' },
  { id: 'ahmedabad', studentName: 'Aditya Shah', city: 'Ahmedabad', state: 'Gujarat', stateId: 'IN-GJ', latitude: 23.0225, longitude: 72.5714, rating: 5, relativeTime: '3 days ago', reviewText: 'The guidance feels structured, patient and focused on real market decisions.', avatar: '/assets/students/student-3.jpeg', size: 'standard' },
  { id: 'jaipur', studentName: 'Neha Jain', city: 'Jaipur', state: 'Rajasthan', stateId: 'IN-RJ', latitude: 26.9124, longitude: 75.7873, rating: 5, relativeTime: '4 days ago', reviewText: 'I appreciated how each topic connected to a practical trading routine.', avatar: '/assets/students/student-4-updated.jpeg', size: 'compact' },
  { id: 'new-delhi', studentName: 'Ananya Gupta', city: 'New Delhi', state: 'Delhi', stateId: 'IN-DL', latitude: 28.6139, longitude: 77.209, rating: 5, relativeTime: '5 days ago', reviewText: 'Clear explanations, useful sessions and a supportive learning experience throughout.', avatar: '/assets/students/student-4.jpeg', size: 'standard' },
  { id: 'lucknow', studentName: 'Manish Yadav', city: 'Lucknow', state: 'Uttar Pradesh', stateId: 'IN-UP', latitude: 26.8467, longitude: 80.9462, rating: 5, relativeTime: '6 days ago', reviewText: 'The focus on risk and process changed how I think about the market.', avatar: '/assets/students/student-5.jpeg', size: 'compact' },
  { id: 'kolkata', studentName: 'Ishita Banerjee', city: 'Kolkata', state: 'West Bengal', stateId: 'IN-WB', latitude: 22.5726, longitude: 88.3639, rating: 5, relativeTime: '1 week ago', reviewText: 'A thoughtful programme that brings market learning closer to real-world practice.', avatar: '/assets/students/student-4-updated.jpeg', size: 'feature' },
  { id: 'bhopal', studentName: 'Priya Mehta', city: 'Bhopal', state: 'Madhya Pradesh', stateId: 'IN-MP', latitude: 23.2599, longitude: 77.4126, rating: 5, relativeTime: '1 week ago', reviewText: 'The sessions gave me a far more confident way to learn and evaluate trades.', avatar: '/assets/testimonials/yashi-cutout.png', size: 'standard' },
  { id: 'hyderabad', studentName: 'Vivek Reddy', city: 'Hyderabad', state: 'Telangana', stateId: 'IN-TG', latitude: 17.385, longitude: 78.4867, rating: 5, relativeTime: '8 days ago', reviewText: 'I value the practical chart work and the calm, structured teaching approach.', avatar: '/assets/testimonials/anadi-cutout.png', size: 'compact' },
  { id: 'bengaluru', studentName: 'Aarav Nair', city: 'Bengaluru', state: 'Karnataka', stateId: 'IN-KA', latitude: 12.9716, longitude: 77.5946, rating: 5, relativeTime: '9 days ago', reviewText: 'A very grounded way to learn market concepts without feeling overwhelmed.', avatar: '/assets/testimonials/amit-cutout.png', size: 'standard' },
  { id: 'chennai', studentName: 'Sneha Verma', city: 'Chennai', state: 'Tamil Nadu', stateId: 'IN-TN', latitude: 13.0827, longitude: 80.2707, rating: 5, relativeTime: '10 days ago', reviewText: 'Live learning and practical guidance made the course feel genuinely useful.', avatar: '/assets/students/student-2.jpeg', size: 'feature' },
  { id: 'kochi', studentName: 'Rohit Kulkarni', city: 'Kochi', state: 'Kerala', stateId: 'IN-KL', latitude: 9.9312, longitude: 76.2673, rating: 5, relativeTime: '2 days ago', reviewText: 'Practical examples and a disciplined learning path helped me build confidence step by step.', avatar: '/assets/students/testimonial-man.jpeg', size: 'compact' },
  { id: 'patna', studentName: 'Karan Patel', city: 'Patna', state: 'Bihar', stateId: 'IN-BR', latitude: 25.5941, longitude: 85.1376, rating: 5, relativeTime: '2 weeks ago', reviewText: 'The right mix of clarity, practice and market discipline for a learner.', avatar: '/assets/students/student-1.jpeg', size: 'standard' },
  { id: 'bhubaneswar', studentName: 'Sasmita Das', city: 'Bhubaneswar', state: 'Odisha', stateId: 'IN-OD', latitude: 20.2961, longitude: 85.8245, rating: 5, relativeTime: '12 days ago', reviewText: 'Every concept is explained in a practical way that makes learning feel approachable.', avatar: '/assets/students/student-2.jpeg', size: 'compact' },
  { id: 'guwahati', studentName: 'Arjun Das', city: 'Guwahati', state: 'Assam', stateId: 'IN-AS', latitude: 26.1445, longitude: 91.7362, rating: 5, relativeTime: '2 weeks ago', reviewText: 'The live sessions brought clarity to the questions I had about market analysis.', avatar: '/assets/testimonials/anadi-cutout.png', size: 'feature' },
  { id: 'raipur', studentName: 'Pallavi Sahu', city: 'Raipur', state: 'Chhattisgarh', stateId: 'IN-CT', latitude: 21.2514, longitude: 81.6296, rating: 5, relativeTime: '3 weeks ago', reviewText: 'A supportive course experience with a strong focus on disciplined decision-making.', avatar: '/assets/testimonials/yashi-cutout.png', size: 'standard' },
  { id: 'ranchi', studentName: 'Nitin Kumar', city: 'Ranchi', state: 'Jharkhand', stateId: 'IN-JH', latitude: 23.3441, longitude: 85.3096, rating: 5, relativeTime: '3 weeks ago', reviewText: 'The learning path feels clear, steady and directly connected to real market practice.', avatar: '/assets/students/student-3.jpeg', size: 'compact' },
  { id: 'panaji', studentName: 'Kavya Desai', city: 'Panaji', state: 'Goa', stateId: 'IN-GA', latitude: 15.4909, longitude: 73.8278, rating: 5, relativeTime: '1 month ago', reviewText: 'The thoughtful guidance gave me confidence to keep learning with a structured process.', avatar: '/assets/students/student-4-updated.jpeg', size: 'feature' },
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
      <span className="india-google-brand"><span className="india-google-mark"><img src="/assets/google-reviews-logo.png" alt="Google" /></span><span>Google Reviews</span></span>
      <time>{location.relativeTime}</time>
    </div>
    <div className="india-review-stars" aria-label={`${location.rating} out of 5 star rating`}>
      {Array.from({ length: 5 }, (_, index) => <i className={`fa-${index < location.rating ? 'solid' : 'regular'} fa-star`} key={index} aria-hidden="true" />)}
    </div>
    <div className="india-review-profile"><img src={location.avatar} alt="" /><div><strong>{location.studentName}</strong><small>{location.city}, {location.state}</small></div></div>
    <p>{location.reviewText}</p>
  </article>;
}

export default function IndiaMapTestimonials() {
  const sectionRef = useRef(null);
  const [features, setFeatures] = useState([]);
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
    fetch('/assets/maps/india-states.geojson').then((response) => (response.ok ? response.json() : Promise.reject())).then((data) => current && setFeatures(data.features || [])).catch(() => current && setFeatures([]));
    return () => { current = false; };
  }, []);
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
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .18 }); observer.observe(section);
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
      <header className="india-testimonials-heading"><p className="section-kicker">STUDENTS ACROSS INDIA</p><h2 id="india-testimonials-title">Trusted Across India</h2><p>Real learners from different cities sharing their experience with Smisha Share Market Academy.</p></header>
      <div className="india-review-map-layout">
        <div className="india-map-panel" aria-label="India map showing student review locations"><div className="india-map-glow" aria-hidden="true" />
          {paths.length ? <svg className="india-state-map" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label="Accurate map of India with state and union territory boundaries"><g className="india-state-paths">{paths.map((path) => <path key={path.id} className={path.id === active.stateId ? 'is-active' : ''} d={path.d} fillRule="evenodd"><title>{path.name}</title></path>)}</g><g className="india-map-markers">{projection && learnerLocations.map((location, index) => {
            if (!visited.includes(index)) return null;
            const [x, y] = projection([location.longitude, location.latitude]); const isActive = index === activeIndex;
            return <g className={`india-map-marker${isActive ? ' is-active' : ''}`} key={location.id} role="button" tabIndex={0} aria-label={`Show ${location.studentName}'s ${location.city} review`} aria-pressed={isActive} onClick={() => activate(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(index); } }}><title>{location.city}, {location.state}</title>{isActive && <circle className="india-marker-pulse" cx={x} cy={y} r="16" />}<circle className="india-marker-core" cx={x} cy={y} r={isActive ? 7.5 : 4.5} /></g>;
          })}</g></svg> : <div className="india-map-loading" aria-live="polite">Loading India map…</div>}
          <a className="india-map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Map data © OpenStreetMap contributors</a>
        </div>
        {visibleCards.map((card) => <GoogleReviewCard key={learnerLocations[card.index].id} location={learnerLocations[card.index]} zone={card.zone} active={card.index === activeIndex} />)}
      </div>
    </div>
  </section>;
}
