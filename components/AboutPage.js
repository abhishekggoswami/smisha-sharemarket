import SiteHeader from './SiteHeader';
import { SiteFooter } from './SharedSiteSections';

const principles = [
  ['fa-chart-line', 'Learn by doing', 'Build understanding through real charts, practical examples, and market-focused learning.'],
  ['fa-compass', 'Trade with discipline', 'Develop a repeatable process that values preparation, risk awareness, and thoughtful decisions.'],
  ['fa-people-group', 'Keep growing together', 'Learn with guidance and a community that keeps your progress moving forward.'],
];

export default function AboutPage() {
  return <main className="course-shell about-page-shell">
    <SiteHeader active="About Us" demoHref="#contact" />

    <section className="about-page-hero" aria-labelledby="about-page-title">
      <div className="about-hero-orbit about-hero-orbit-one" aria-hidden="true" />
      <div className="about-hero-orbit about-hero-orbit-two" aria-hidden="true" />
      <div className="about-page-hero-inner">
        <div>
          <p className="course-kicker"><i className="fa-solid fa-seedling" /> About Smisha</p>
          <h1 id="about-page-title"><span>Market education for</span><br /><strong>clearer, steadier decisions.</strong></h1>
          <p>Smisha Share Market Classes helps aspiring traders turn curiosity into practical market knowledge, disciplined habits, and the confidence to act with intention.</p>
          <a className="course-primary-button" href="#contact">Talk to our team <i className="fa-solid fa-phone" /></a>
        </div>
        <aside className="about-hero-note" aria-label="Smisha learning approach">
          <i className="fa-solid fa-lightbulb" aria-hidden="true" />
          <p>OUR APPROACH</p>
          <strong>Practical learning.<br />Real guidance.<br />Lasting confidence.</strong>
        </aside>
      </div>
    </section>

    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-story-media">
        <img src="/assets/about-mission-event.png" alt="A Smisha Share Market learning event" />
        <span>SMISHA SHARE MARKET</span>
      </div>
      <div className="about-story-copy">
        <p className="section-label">OUR STORY</p>
        <h2 id="about-story-title">We make the market<br /><strong>more approachable.</strong></h2>
        <p>Markets can feel overwhelming when learning stays theoretical. At Smisha, our focus is on helping learners connect concepts with the situations they will actually encounter: reading charts, understanding risk, building a process, and asking better questions.</p>
        <p>Whether you are taking your first step or refining an existing approach, our learning experience is built to be clear, practical, and grounded in long-term thinking.</p>
      </div>
    </section>

    <section className="about-principles" aria-labelledby="principles-title">
      <div className="about-section-heading"><p className="section-label">WHAT GUIDES US</p><h2 id="principles-title">A better way to<br /><strong>learn the markets.</strong></h2></div>
      <div className="about-principles-grid">
        {principles.map(([icon, title, text], index) => <article key={title}>
          <span>0{index + 1}</span><i className={`fa-solid ${icon}`} aria-hidden="true" /><h3>{title}</h3><p>{text}</p>
        </article>)}
      </div>
    </section>

    <section className="about-vision" aria-labelledby="vision-title">
      <div><p className="section-label">OUR VISION</p><h2 id="vision-title">Help more people approach<br /><strong>the markets with confidence.</strong></h2></div>
      <p>We believe financial learning should feel useful from the start. Our vision is to support learners with accessible education, practical exposure, and guidance that encourages informed, responsible participation in the market.</p>
    </section>

    <section className="about-contact" id="contact" aria-labelledby="contact-title">
      <div className="about-contact-copy"><p className="section-label">GET IN TOUCH</p><h2 id="contact-title">Start the conversation<br /><strong>when you are ready.</strong></h2><p>Have a question about learning with Smisha? Our team is here to help you take the next informed step.</p></div>
      <div className="about-contact-cards">
        <a href="mailto:support@smishasharemarket.com"><i className="fa-regular fa-envelope" aria-hidden="true" /><span><small>EMAIL US</small>support@smishasharemarket.com</span></a>
        <a href="tel:+917420001687"><i className="fa-solid fa-phone" aria-hidden="true" /><span><small>CALL US</small>+91 7420001687</span></a>
        <a href="tel:+917420040030"><i className="fa-solid fa-phone" aria-hidden="true" /><span><small>CALL US</small>+91 7420040030</span></a>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
