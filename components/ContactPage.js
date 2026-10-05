import AcademyMap from './AcademyMap';
import SiteHeader from './SiteHeader';
import { SiteFooter } from './SharedSiteSections';

export default function ContactPage() {
  return <main className="course-shell contact-page-shell">
    <SiteHeader active="Contact" demoHref="#contact-details" />
    <section className="contact-page-hero" aria-labelledby="contact-page-title">
      <div><p className="course-kicker"><i className="fa-solid fa-location-dot" /> Contact Smisha</p><h1 id="contact-page-title"><span>Let’s start your market</span><br /><strong>learning journey.</strong></h1><p>Reach out to the Smisha Share Market team for guidance on courses, workshops, and practical market education.</p></div>
    </section>
    <section className="contact-page-content" id="contact-details" aria-labelledby="contact-details-title">
      <div className="contact-page-details"><p className="section-label">CONNECT WITH US</p><h2 id="contact-details-title">We are here to<br /><strong>help you begin.</strong></h2><p>Choose the easiest way to connect with our team.</p><div className="contact-details-list"><a href="mailto:support@smishasharemarket.com"><i className="fa-regular fa-envelope" aria-hidden="true" /><span><small>EMAIL US</small>support@smishasharemarket.com</span></a><a href="tel:+917420001687"><i className="fa-solid fa-phone" aria-hidden="true" /><span><small>CALL US</small>+91 7420001687</span></a><a href="tel:+917420040030"><i className="fa-solid fa-phone" aria-hidden="true" /><span><small>CALL US</small>+91 7420040030</span></a></div></div>
      <div className="contact-map-panel"><div><p className="section-label">ACADEMY LOCATION</p><h2>Visit Smisha Share<br />Market Institute.</h2></div><AcademyMap /></div>
    </section>
    <SiteFooter />
  </main>;
}
