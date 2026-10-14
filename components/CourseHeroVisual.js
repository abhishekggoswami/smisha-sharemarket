import { courses } from '../lib/course-catalog';
import CourseBoardTitle from './CourseBoardTitle';

const heroArtwork = Object.fromEntries(courses.map(c=>[c.slug,{theme:c.theme,title:c.boardTitle}]));

export default function CourseHeroVisual({ slug, outline }) {
  const item = heroArtwork[slug] ?? heroArtwork[courses[0].slug];
  const titleLines = item.title.split('\n');
  return <aside className={`course-hero-visual course-hero-visual--${item.theme}`} aria-label={`${titleLines.join(' ')} course visual`}>
    <div className="course-hero-board">
      <span>SMISHA ACADEMY</span>
      {outline ? <CourseBoardTitle slug={slug} title={item.title} outline={outline} /> : <strong>{titleLines.map(line=><span key={line}>{line}</span>)}</strong>}
      <i />
    </div>
  </aside>;
}
