import SmartInvestingBoardTitle from './SmartInvestingBoardTitle';

const heroArtwork = {
  'smart-investing-fundamentals': { theme: 'foundation', title: 'Smart Investing' },
  'mutual-fund-wealth-builder': { theme: 'funds', title: 'Mutual Fund\nWealth Builder' },
  'technical-analysis-blueprint': { theme: 'technical', title: 'Technical\nAnalysis' },
  'professional-options-trading': { theme: 'options', title: 'Options\nTrading' },
  'value-investing-blueprint': { theme: 'value', title: 'Value\nInvesting' },
  'professional-equity-research-analyst-program': { theme: 'research', title: 'Equity Research' },
  'nism-xv-research-analyst-exam-prep': { theme: 'nism', title: 'NISM XV\nExam Prep' },
};

export default function CourseHeroVisual({ slug }) {
  const item = heroArtwork[slug] ?? heroArtwork['smart-investing-fundamentals'];
  const titleLines = item.title.split('\n');
  return <aside className={`course-hero-visual course-hero-visual--${item.theme}`} aria-label={`${titleLines.join(' ')} course visual`}>
    <div className="course-hero-board">
      <span>SMISHA ACADEMY</span>
      {slug === 'smart-investing-fundamentals'
        ? <SmartInvestingBoardTitle />
        : <strong>{titleLines.map((line) => <b key={line}>{line}</b>)}</strong>}
      <i />
    </div>
  </aside>;
}
