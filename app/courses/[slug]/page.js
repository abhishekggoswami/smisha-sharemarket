import CourseDetailPage from '../../../components/CourseDetailPage';

export const dynamicParams = false;

export default async function CourseDetail({ params }) {
  const { slug } = await params;
  return <CourseDetailPage slug={slug} />;
}

export function generateStaticParams() {
  return [
    'smart-investing-fundamentals', 'mutual-fund-wealth-builder', 'technical-analysis-blueprint',
    'professional-options-trading', 'value-investing-blueprint', 'professional-equity-research-analyst-program',
    'nism-xv-research-analyst-exam-prep',
  ].map((slug) => ({ slug }));
}
