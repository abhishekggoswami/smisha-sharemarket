'use client';

import { useEffect, useRef, useState } from 'react';
import CourseThumbnail from './CourseThumbnail';

const courses = [
  { slug: 'smart-investing-fundamentals', title: <>Smart Investing<br />Fundamentals</>, label: 'Smart Investing Fundamentals', description: 'Build a confident foundation in markets, portfolios, risk, and long-term investing.' },
  { slug: 'mutual-fund-wealth-builder', title: <>Mutual Fund<br />Wealth Builder</>, label: 'Mutual Fund Wealth Builder', description: 'Build a goal-led mutual fund plan with clearer fund selection and risk awareness.' },
  { slug: 'technical-analysis-blueprint', title: <>Technical Analysis<br />Blueprint</>, label: 'Technical Analysis Blueprint', description: 'Learn to read charts, identify trends, and build clearer trading decisions.' },
  { slug: 'professional-options-trading', title: <>Professional Options<br />Trading</>, label: 'Professional Options Trading', description: 'Understand options, strategies, risk management, and disciplined execution.' },
  { slug: 'value-investing-blueprint', title: <>Value Investing<br />Blueprint</>, label: 'Value Investing Blueprint', description: 'Learn to evaluate businesses, value stocks, and build a long-term portfolio.' },
  { slug: 'professional-equity-research-analyst-program', title: <>Equity Research<br />Analyst Program</>, label: 'Professional Equity Research Analyst Program', description: 'Develop practical research, valuation, modelling, and reporting skills.' },
  { slug: 'nism-xv-research-analyst-exam-prep', title: <>NISM XV Research<br />Analyst Exam Prep</>, label: 'NISM XV Research Analyst Exam Prep', description: 'Prepare with a guided syllabus, case studies, mock tests, and revision.' },
];

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
      <div><p className="section-kicker">Learn With Smisha</p><h2 id="services-title"><strong>Explore our courses.</strong><span>Build your market edge.</span></h2></div>
      <div className="services-actions"><div className="services-carousel-controls" aria-label="Featured course navigation"><button type="button" onClick={previous} aria-label="Show previous courses"><i className="fa-solid fa-arrow-trend-down" aria-hidden="true" /></button><button type="button" onClick={next} aria-label="Show next courses"><i className="fa-solid fa-arrow-trend-up" aria-hidden="true" /></button></div><a className="services-button" href="/courses">Explore courses <b><i className="fa-solid fa-chart-line" aria-hidden="true" /></b></a></div>
    </div>
    <div className="services-carousel-viewport" ref={viewportRef} aria-live="polite">
      <div className="services-grid" ref={trackRef}>{courses.map((course) => <a className="service-card service-card-link" href={`/courses/${course.slug}`} key={course.slug} aria-label={`View the ${course.label} course`}><div className="service-card-top"><div><h3>{course.title}</h3><p>{course.description}</p></div><span className="course-card-signal" aria-hidden="true"><i className="fa-solid fa-chart-line" /></span></div><CourseThumbnail slug={course.slug} className="service-course-thumbnail" /></a>)}</div>
    </div>
  </div>;
}
