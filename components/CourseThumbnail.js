import { courses } from '../lib/course-catalog';
const artwork = Object.fromEntries(courses.map(c=>[c.slug,c]));

const instructors = {
  sushil: '/assets/instructors/sushil-course-cutout.webp',
  'sushil-navy': '/assets/instructors/sushil-navy-hero-cutout.webp',
  'sushil-olive': '/assets/instructors/sushil-olive-hero-cutout.webp',
  'sushil-black': '/assets/instructors/sushil-black-hero-cutout.webp',
  'sushil-value': '/assets/instructors/sushil-value-course-cutout.webp',
  navy: '/assets/instructors/instructor-navy-course-cutout.webp',
  charcoal: '/assets/instructors/instructor-charcoal-course-cutout.webp',
};

const marketBackgrounds = Object.fromEntries(courses.map(c=>[c.slug,'/assets/course-backgrounds/'+c.marketVideo]));

export default function CourseThumbnail({ slug, className = '' }) {
  const item = artwork[slug] ?? artwork[courses[0].slug];
  const titleLines = item.boardTitle.split('\n');
  const marketVideo = marketBackgrounds[slug];
  return <div className={`course-art course-art--${item.theme} course-instructor-art ${className}`} role="group" aria-label={`${titleLines.join(' ')} course with ${item.facultyName || "an instructor"}`}>
    {marketVideo && <video className="course-art-market-video" data-src={marketVideo} data-deferred-video="true" autoPlay muted loop playsInline preload="none" aria-hidden="true" />}
    <div className="course-whiteboard" aria-hidden="true">
      <span className="course-board-label">SMISHA ACADEMY</span>
      <strong>{titleLines.map((line) => <span key={line}>{line}</span>)}</strong>
      <i className="course-board-marker" />
    </div>
    <div className={`course-card-instructor course-card-instructor--${item.instructor}`} aria-hidden="true">
      <img decoding="async" loading="lazy" src={instructors[item.instructor]} alt="" />
    </div>
    <div className="course-card-benefits" aria-hidden="true"><span><i className="fa-solid fa-circle-check" /> Live learning</span><span><i className="fa-solid fa-people-group" /> Mentor support</span></div>
  </div>;
}
