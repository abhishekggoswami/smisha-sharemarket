const artwork = {
  'smart-investing-fundamentals': { theme: 'foundation', boardTitle: 'Smart Investing', instructor: 'sushil' },
  'mutual-fund-wealth-builder': { theme: 'funds', boardTitle: 'Mutual Fund\nWealth Builder', instructor: 'navy' },
  'technical-analysis-blueprint': { theme: 'technical', boardTitle: 'Technical\nAnalysis', instructor: 'sushil-navy' },
  'professional-options-trading': { theme: 'options', boardTitle: 'Options\nTrading', instructor: 'sushil-olive' },
  'value-investing-blueprint': { theme: 'value', boardTitle: 'Value\nInvesting', instructor: 'sushil-value' },
  'professional-equity-research-analyst-program': { theme: 'research', boardTitle: 'Equity Research', instructor: 'navy' },
  'nism-xv-research-analyst-exam-prep': { theme: 'nism', boardTitle: 'NISM XV\nExam Prep', instructor: 'charcoal' },
};

const instructors = {
  sushil: '/assets/instructors/sushil-course-cutout.png',
  'sushil-navy': '/assets/instructors/sushil-navy-hero-cutout.png',
  'sushil-olive': '/assets/instructors/sushil-olive-hero-cutout.png',
  'sushil-black': '/assets/instructors/sushil-black-hero-cutout.png',
  'sushil-value': '/assets/instructors/sushil-value-course-cutout.png',
  navy: '/assets/instructors/instructor-navy-course-cutout.png',
  charcoal: '/assets/instructors/instructor-charcoal-course-cutout.png',
};

const marketBackgrounds = {
  'smart-investing-fundamentals': '/assets/course-backgrounds/foundation-market-web.mp4',
  'mutual-fund-wealth-builder': '/assets/course-backgrounds/funds-market-web.mp4',
  'technical-analysis-blueprint': '/assets/course-backgrounds/technical-market-web.mp4',
  'professional-options-trading': '/assets/course-backgrounds/options-market-web.mp4',
  'value-investing-blueprint': '/assets/course-backgrounds/value-market-web.mp4',
  'professional-equity-research-analyst-program': '/assets/course-backgrounds/value-market-web.mp4',
  'nism-xv-research-analyst-exam-prep': '/assets/course-backgrounds/foundation-market-web.mp4',
};

export default function CourseThumbnail({ slug, className = '' }) {
  const item = artwork[slug] ?? artwork['smart-investing-fundamentals'];
  const titleLines = item.boardTitle.split('\n');
  const marketVideo = marketBackgrounds[slug];
  return <div className={`course-art course-art--${item.theme} course-instructor-art ${className}`} role="group" aria-label={`${titleLines.join(' ')} course with an instructor`}>
    {marketVideo && <video className="course-art-market-video" src={marketVideo} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />}
    <div className="course-whiteboard" aria-hidden="true">
      <span className="course-board-label">SMISHA ACADEMY</span>
      <strong>{titleLines.map((line) => <span key={line}>{line}</span>)}</strong>
      <i className="course-board-marker" />
    </div>
    <div className={`course-card-instructor course-card-instructor--${item.instructor}`} aria-hidden="true">
      <img src={instructors[item.instructor]} alt="" />
    </div>
    <div className="course-card-benefits" aria-hidden="true"><span><i className="fa-solid fa-circle-check" /> Live learning</span><span><i className="fa-solid fa-people-group" /> Mentor support</span></div>
  </div>;
}
