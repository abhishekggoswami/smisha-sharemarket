const footerSocialLinks = [
  ['Instagram', 'https://www.instagram.com/smisha_share_market?stkn=c2ltZjM4NHI0NWtl', 'instagram', 'fa-instagram'],
  ['LinkedIn', 'https://www.linkedin.com/company/smishasharemarket/', 'linkedin', 'fa-linkedin-in'],
  ['YouTube', 'https://youtube.com/@smishasharemarket?si=qjirOFVlyB8LjEW_', 'youtube', 'fa-youtube'],
  ['WhatsApp', 'https://wa.link/gi2b8d', 'whatsapp', 'fa-whatsapp'],
];

function FooterSocialLinks() {
  return <div className="footer-socials social-login-icons" aria-label="Social media links">
    {footerSocialLinks.map(([label, href, network, icon]) => <a className={`socialcontainer social-${network}`} href={href} target="_blank" rel="noreferrer" aria-label={label} key={label}><span className="social-icon social-icon-primary"><i className={`fa-brands ${icon}`} aria-hidden="true" /></span><span className="social-icon social-icon-reveal"><i className={`fa-brands ${icon}`} aria-hidden="true" /></span></a>)}
  </div>;
}

export function SiteCTA({ label = 'READY TO START YOUR TRADING JOURNEY?', children }) {
  return <section className="course-cta"><p>{label}</p><h2>{children}</h2><a href="#contact">Book Your Free Demo <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a></section>;
}

export function SiteFAQ() {
  return <section className="faq-section" id="faq" aria-labelledby="shared-faq-title">
    <div className="faq-heading"><div><p className="section-kicker">Frequently Asked, Clearly Answered</p><h2 id="shared-faq-title"><strong>Everything You Need To Know</strong><span>Before Getting Started</span></h2></div><a className="faq-all-link" href="#contact">All Questions Answered <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a></div>
    <div className="faq-layout"><div className="faq-list"><details className="faq-item"><summary>Are your stock market courses suitable for beginners?</summary><p>Yes. We begin with clear fundamentals and build step by step, so you can learn with confidence even if you are completely new to the market.</p></details><details className="faq-item"><summary>Do you provide live market sessions?</summary><p>Yes. Our learning experience includes practical chart discussions and live-market guidance to help you connect concepts with real trading situations.</p></details><details className="faq-item"><summary>Which markets and strategies can I learn?</summary><p>You can learn equity, derivatives, forex, and crypto concepts along with technical analysis, risk management, and trading psychology.</p></details><details className="faq-item"><summary>Are the classes available online and offline?</summary><p>Yes. Smisha Share Market offers flexible learning options so you can choose the format that best fits your schedule and learning style.</p></details><details className="faq-item"><summary>Will I receive mentorship after joining?</summary><p>Yes. You receive continued guidance, doubt support, and practical feedback to help you improve your market understanding and build disciplined trading habits.</p></details></div><aside className="faq-help-card"><span className="faq-help-icon" aria-hidden="true"><i className="fa-solid fa-question" /></span><h3>Don&apos;t Worry — We&apos;ve Got Answers!</h3><p>Need help choosing the right course or have a question that isn&apos;t listed here? Our team is ready to guide you.</p><a href="#contact">Ask a Question <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a></aside></div>
  </section>;
}

export function SiteFooter() {
  return <footer className="site-footer" id="contact">
    <div className="footer-contact-strip">
      <span className="footer-ring ring-a" aria-hidden="true" />
      <span className="footer-ring ring-b" aria-hidden="true" />
      <span className="footer-ring ring-c" aria-hidden="true" />

      <p>Ready to start your trading journey?</p>

      <a href="mailto:support@smishasharemarket.com">
        <span className="footer-mail-icon">
          <i className="fa-regular fa-envelope" aria-hidden="true" />
        </span>

        <span>
          <small>Send us an email</small>
          <span className="footer-email-address">
            support@<wbr />smishasharemarket.com
          </span>
        </span>
      </a>
    </div>

    <div className="footer-main">
      <section className="footer-brand" aria-label="Smisha Share Market">
        <a className="footer-logo" href="/">
          <img src="/assets/smisha-logo.png" alt="Smisha Share Market Classes" />
          <span>
            SMISHA <small>SHARE MARKET</small>
          </span>
        </a>

        <p>
          Practical stock market education built around knowledge, discipline,
          and real trading confidence.
        </p>

        <FooterSocialLinks />
      </section>

      <section className="footer-links">
        <h2>Academy</h2>
        <a href="/about">About Us</a>
        <a href="/courses">Courses</a>
        <a href="/workshops">Workshops</a>
        <a href="/#services">Our Programs</a>
        <a href="/#stories">Student Stories</a>
        <a href="/#process">How It Works</a>
      </section>

      <section className="footer-links">
        <h2>Learning Paths</h2>
        <a href="/courses">Equity Trading</a>
        <a href="/courses">Technical Analysis</a>
        <a href="/courses">Risk Management</a>
        <a href="/courses">Trading Psychology</a>
        <a href="#faq">FAQs</a>
      </section>

      <section className="footer-newsletter">
        <h2>Newsletter</h2>
        <p>Get market-learning tips and academy updates.</p>

        <div className="newsletter-input">
          <input
            type="email"
            aria-label="Email address"
            placeholder="Enter your email"
          />

          <button type="button" aria-label="Subscribe">
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>

        <small>
          <i className="fa-regular fa-bell" aria-hidden="true" /> No spam—just
          useful trading insights.
        </small>
      </section>
    </div>

    <div className="footer-bottom">
      <p>© 2026 Smisha Share Market Classes. All rights reserved.</p>

      <div>
        <a href="/">Terms &amp; Conditions</a>
        <a href="/">Privacy Policy</a>
        <a href="/">Legal</a>
      </div>
    </div>
  </footer>;
}
