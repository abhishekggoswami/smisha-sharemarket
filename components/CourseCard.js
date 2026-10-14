import CourseThumbnail from './CourseThumbnail';
import CourseCardFacts from './CourseCardFacts';
export default function CourseCard({course,className=""}) {
 const href="/courses/"+course.slug;
 return <article className={"course-card course-card-link "+className} aria-label={"View the "+course.title+" course"}><a className="course-card-top" href={href}><div><p className="course-subtitle">{course.subtitle}</p><h3>{course.title}</h3><p className="course-description">{course.description}</p></div><span className="course-card-arrow" aria-hidden="true"><i className="fa-solid fa-arrow-right"/></span></a><a href={href} aria-label={"View "+course.title}><CourseThumbnail slug={course.slug} className="course-media"/></a><CourseCardFacts course={course}/></article>;
}