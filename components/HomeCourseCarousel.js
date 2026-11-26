'use client';

import { useEffect, useRef, useState } from 'react';
import CourseCard from './CourseCard';
import { courses } from '../lib/course-catalog';
import SplitText from './SplitText';



const visibleCards = () => window.matchMedia('(max-width: 640px)').matches ? 1 : window.matchMedia('(max-width: 1024px)').matches ? 2 : 3;

export default function HomeCourseCarousel() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(3);
  const [index, setIndex] = useState(0);
  const [headingCycle, setHeadingCycle] = useState(0);
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

  useEffect(() => {
    const section = viewportRef.current?.closest('.services-section');
    if (!section) return undefined;

    let observer;
    const beginSectionMotion = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setHeadingCycle((cycle) => cycle + 1);
        return;
      }

      if (!('IntersectionObserver' in window)) {
        section.classList.add('is-visible');
        setHeadingCycle((cycle) => cycle + 1);
        return;
      }

      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add('is-visible');
        setHeadingCycle((cycle) => cycle + 1);
        observer.disconnect();
      }, { threshold: 0 });
      observer.observe(section.querySelector('.services-heading') || section);
    };

    const loaderFinished = window.__SMISHA_LOADER_COMPLETE__ || !document.querySelector('.smisha-loader');
    if (loaderFinished) beginSectionMotion();
    else window.addEventListener('smisha-loader-complete', beginSectionMotion, { once: true });

    return () => {
      window.removeEventListener('smisha-loader-complete', beginSectionMotion);
      observer?.disconnect();
      section.classList.remove('is-visible');
    };
  }, []);

  const previous = () => setIndex((current) => current <= 0 ? maxIndex : current - 1);
  const next = () => setIndex((current) => current >= maxIndex ? 0 : current + 1);

  return <div className="home-courses-carousel">
    <div className="services-heading">
      <div><p className="section-kicker">Learn With Smisha</p><h2 id="services-title"><strong>{headingCycle ? <SplitText key={`courses-title-first-${headingCycle}`} text="Explore our courses." className="services-title-line" delay={22} duration={0.62} effect="rise" splitType="words, chars" staggerFrom="start" mask={false} /> : 'Explore our courses.'}</strong><span>{headingCycle ? <SplitText key={`courses-title-second-${headingCycle}`} text="Build your market edge." highlightWords="2" className="services-title-line" delay={22} duration={0.62} effect="rise" splitType="words, chars" staggerFrom="start" mask={false} /> : <>Build your <em className="heading-gold">market</em> edge.</>}</span></h2><p className="section-subheading services-subheading">Learn practical market skills with guided courses designed for every stage of your journey.</p></div>
      <div className="services-actions"><div className="services-carousel-controls" aria-label="Featured course navigation"><button type="button" onClick={previous} disabled={maxIndex===0} aria-label="Show previous courses"><i className="fa-solid fa-arrow-trend-down" aria-hidden="true" /></button><button type="button" onClick={next} disabled={maxIndex===0} aria-label="Show next courses"><i className="fa-solid fa-arrow-trend-up" aria-hidden="true" /></button></div><a className="services-button" href="/courses">Explore courses <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a></div>
    </div>
    <div className="services-carousel-viewport" ref={viewportRef} aria-live="polite">
      <div className="services-grid" ref={trackRef}>{courses.map(course=><CourseCard key={course.slug} course={course} className="service-card service-card-link"/>)}</div>
    </div>
  </div>;
}
