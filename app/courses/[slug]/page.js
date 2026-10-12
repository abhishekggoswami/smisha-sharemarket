import CourseDetailPage from '../../../components/CourseDetailPage';
import { courses, moduleGuides } from '../../../lib/course-content';
import { courseBoardTitleOutlines } from '../../../lib/generated/courseBoardTitleOutlines';

export const dynamicParams = false;

export default async function CourseDetail({ params }) {
  const { slug } = await params;
  const selected = courses.find(course => course.slug === slug) ?? courses[0];
  const course = { ...selected, modules: selected.modules.map(module => ({ ...module, guide: moduleGuides[module.title]?.[0] ?? module.outcome })) };
  const related = courses.filter(item => item.slug !== slug).slice(0, 3).map(({ modules, ...item }) => ({ ...item, moduleCount: modules.length }));
  return <CourseDetailPage related={related} course={course} boardOutline={courseBoardTitleOutlines[slug] ?? null} />;
}

export function generateStaticParams() {
  return courses.map(({ slug }) => ({ slug }));
}
