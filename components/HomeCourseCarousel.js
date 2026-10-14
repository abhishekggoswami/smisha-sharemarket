'use client';

import { useEffect, useRef, useState } from 'react';
import CourseCard from './CourseCard';
import { courses } from '../lib/course-catalog';
import TextPressure from './TextPressure';



const visibleCards = () => window.matchMedia('(max-width: 640px)').matches ? 1 : window.matchMedia('(max-width: 1024px)').matches ? 2 : 3;

export default function HomeCourseCarousel() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(3);
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, courses.length - visible);

  useEffect(() => {
    const updateVisible = () => {
      const nextVisible = visibleCards();
      setVisible(nextVisible);
      setIndex((current) => Math.min(current, Math.max(0, courses.length - nextVisible)));
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const card = track?.children[index];
    if (!viewport || !track || !card) return;
    viewport.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }, [index, visible]);

  const previous = () => setIndex((current) => current <= 0 ? maxIndex : current - 1);
  const next = () => setIndex((current) => current >= maxIndex ? 0 : current + 1);

  return <div className="home-courses-carousel">
    <div className="services-heading">
      <div><p className="section-kicker">Learn With Smisha</p><h2 id="services-title"><strong><TextPressure text="Explore our courses." minWeight={700} /></strong><span><TextPressure text="Build your market edge." /></span></h2></div>
      <div className="services-actions"><div className="services-carousel-controls" aria-label="Featured course navigation"><button type="button" onClick={previous} disabled={maxIndex===0} aria-label="Show previous courses"><i className="fa-solid fa-arrow-trend-down" aria-hidden="true" /></button><button type="button" onClick={next} disabled={maxIndex===0} aria-label="Show next courses"><i className="fa-solid fa-arrow-trend-up" aria-hidden="true" /></button></div><a className="services-button" href="/courses">Explore courses <b><i className="fa-solid fa-chart-line" aria-hidden="true" /></b></a></div>
    </div>
    <div className="services-carousel-viewport" ref={viewportRef} aria-live="polite">
      <div className="services-grid" ref={trackRef}>{courses.map(course=><CourseCard key={course.slug} course={course} className="service-card service-card-link"/>)}</div>
    </div>
  </div>;
}
