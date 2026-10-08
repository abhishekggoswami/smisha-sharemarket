const heroArtwork = {
  'smart-investing-fundamentals': { theme: 'foundation', title: 'Smart Investing', image: '/assets/instructors/sushil-course-cutout.png', pose: 'beige' },
  'mutual-fund-wealth-builder': { theme: 'funds', title: 'Mutual Fund\nWealth Builder', image: '/assets/instructors/instructor-navy-course-cutout.png', pose: 'navy' },
  'technical-analysis-blueprint': { theme: 'technical', title: 'Technical\nAnalysis', image: '/assets/instructors/sushil-navy-hero-cutout.png', pose: 'sushil-navy' },
  'professional-options-trading': { theme: 'options', title: 'Options\nTrading', image: '/assets/instructors/sushil-olive-hero-cutout.png', pose: 'sushil-olive' },
  'value-investing-blueprint': { theme: 'value', title: 'Value\nInvesting', image: '/assets/instructors/sushil-value-course-cutout.png', pose: 'sushil-value' },
  'professional-equity-research-analyst-program': { theme: 'research', title: 'Equity Research', image: '/assets/instructors/instructor-navy-course-cutout.png', pose: 'navy' },
  'nism-xv-research-analyst-exam-prep': { theme: 'nism', title: 'NISM XV\nExam Prep', image: '/assets/instructors/instructor-charcoal-course-cutout.png', pose: 'charcoal' },
};

export default function CourseHeroVisual({ slug }) {
  const item = heroArtwork[slug] ?? heroArtwork['smart-investing-fundamentals'];
  const titleLines = item.title.split('\n');
  return <aside className={`course-hero-visual course-hero-visual--${item.theme}`} aria-label={`${titleLines.join(' ')} course visual`}>
    <div className="course-hero-board">
      <span>SMISHA ACADEMY</span>
      <strong>{titleLines.map((line) => <b key={line}>{line}</b>)}</strong>
      <i />
    </div>
    <div className={`course-hero-instructor course-hero-instructor--${item.pose}`} aria-hidden="true"><img src={item.image} alt="" /></div>
    <div className="course-hero-proof" aria-hidden="true"><span><i className="fa-solid fa-circle-check" /> Live market cases</span><span><i className="fa-solid fa-people-group" /> Mentor-led learning</span></div>
  </aside>;
}
