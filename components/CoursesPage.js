'use client';
import SiteHeader from './SiteHeader';
import CourseCard from './CourseCard';
import { courses } from '../lib/course-catalog';
import TextPressure from './TextPressure';

import { useState } from 'react';
import { SiteCTA, SiteFAQ, SiteFooter } from './SharedSiteSections';



const courseSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function CoursesPage() {

  const [selectedCourse, setSelectedCourse] = useState(null);
  return <main className="course-shell">
    <SiteHeader active="Courses" demoHref="/contact" />
    <section className="course-hero course-hero--mentors" aria-labelledby="courses-title">
      <video className="course-hero-atmosphere" src="/assets/courses/courses-hero-atmosphere.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      <div className="course-hero-atmosphere-shade" aria-hidden="true" />
      <div className="course-hero-ring ring-one" /><div className="course-hero-ring ring-two" /><div className="course-hero-grid" />
      <div className="course-hero-content"><p className="course-kicker"><i className="fa-solid fa-sparkles" /> Learn from Pune&apos;s market mentors</p><h1 id="courses-title"><TextPressure text="Build your market edge" /><br /><strong><TextPressure text="with the right mentors." minWeight={700} /></strong></h1><p className="course-hero-copy">Practical market education shaped by live examples, clear guidance and the people who teach it every day.</p><div className="course-hero-actions"><a className="course-primary-button" href="#course-list">Explore courses <i className="fa-solid fa-arrow-down" /></a></div><div className="course-mentor-stats" aria-label="Three market mentors and three learning paths"><span><b>3</b> market mentors</span><span><b>3</b> learning paths</span></div></div>
      <div className="course-hero-instructors"><div className="course-mentor-face"><img src="/assets/instructors/instructor-charcoal-course-cutout.webp" alt="" /><div className="course-mentor-identity"><strong>Rahul Kotkar</strong><span>Trainer</span></div></div><div className="course-mentor-face course-mentor-face--sushil"><img src="/assets/instructors/sushil-olive-hero-cutout.webp" alt="" /><div className="course-mentor-identity"><strong>Sushil Kumar Kamboj</strong><span>Managing Director</span></div></div><div className="course-mentor-face"><img src="/assets/instructors/instructor-navy-course-cutout.webp" alt="" /><div className="course-mentor-identity"><strong>Nitin Kumar</strong><span>Manager</span></div></div></div>
    </section>
    <section className="course-intro" id="course-list" aria-labelledby="course-list-heading"><div><p className="section-label">OUR COURSE LIBRARY</p><h2 id="course-list-heading"><TextPressure text="Learn the skills that make " /><strong><TextPressure text="every decision clearer." minWeight={700} /></strong></h2></div><p>Choose a focused starting point or build your capability across investing, trading, research and certification.</p></section>
    <section className="course-grid" aria-label="Courses">{courses.map(course=><CourseCard key={course.slug} course={course}/>)}</section>
    <SiteCTA><span>Let’s find the right</span><br /><strong>learning path for you.</strong></SiteCTA>
    <SiteFAQ />
    <SiteFooter />
    {selectedCourse && <div className="curriculum-dialog" role="dialog" aria-modal="true" aria-labelledby="curriculum-title" onClick={() => setSelectedCourse(null)}><div className="curriculum-panel" onClick={(event) => event.stopPropagation()}><button className="dialog-close" type="button" onClick={() => setSelectedCourse(null)} aria-label="Close curriculum"><i className="fa-solid fa-xmark" /></button><p className="section-label">COURSE CURRICULUM</p><p className="dialog-subtitle">{selectedCourse.subtitle}</p><h2 id="curriculum-title">{selectedCourse.title}</h2><p className="dialog-description">{selectedCourse.description}</p><div className="dialog-stats"><span><i className="fa-regular fa-clock" /> {selectedCourse.duration}</span><span><i className="fa-solid fa-signal" /> {selectedCourse.level}</span></div><ol className="module-list">{selectedCourse.modules.map((module, index) => <li key={module}><span>{String(index + 1).padStart(2, '0')}</span>{module}</li>)}</ol><a className="course-primary-button dialog-cta" href="mailto:support@smishasharemarket.com">Enquire about this course <i className="fa-solid fa-arrow-right" /></a></div></div>}
  </main>;
}
