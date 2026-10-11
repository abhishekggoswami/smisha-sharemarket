'use client';

import { useState } from 'react';
import AcademyMap from './AcademyMap';
import Lanyard from './Lanyard';
import SiteHeader from './SiteHeader';
import { SiteFooter } from './SharedSiteSections';
import TextPressure from './TextPressure';

function ContactEnquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <div className="contact-enquiry-success" role="status"><i className="fa-solid fa-circle-check" aria-hidden="true" /><p className="section-label">ENQUIRY RECEIVED</p><h2>Thank you for reaching out.</h2><p>Our Smisha team will connect with you shortly to help you choose your next learning step.</p><button type="button" onClick={() => setSubmitted(false)}>Send another enquiry <i className="fa-solid fa-arrow-right" aria-hidden="true" /></button></div>;

  return <form className="contact-enquiry-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
    <div className="contact-form-heading"><div><p className="section-label">START YOUR ENQUIRY</p><h2>Let&apos;s plan your<br /><strong>next market move.</strong></h2></div></div>
    <div className="contact-form-fields">
      <label>Full name<input required name="name" autoComplete="name" placeholder="Enter your name" /></label>
      <label>Phone number<input required name="phone" autoComplete="tel" inputMode="tel" placeholder="Enter your phone number" /></label>
      <label className="contact-form-wide">Email address<input required type="email" name="email" autoComplete="email" placeholder="Enter your email address" /></label>
      <label className="contact-form-wide">What would you like to learn?<input required name="interest" placeholder="e.g. Smart investing, technical analysis, or a workshop" /></label>
      <label className="contact-form-wide">How can we help?<textarea required name="message" rows="4" placeholder="Tell us what you would like to learn" /></label>
    </div>
    <button type="submit" className="contact-form-submit btn btn-primary"><span className="btn-txt">Send enquiry</span><kbd className="btn-kbd" aria-hidden="true"><i className="fa-solid fa-arrow-right" /></kbd></button>
    <p className="contact-form-note">No dropdowns, no pressure—just tell us how we can help.</p>
  </form>;
}

export default function ContactPage() {
  return <main className="course-shell contact-page-shell">
    <SiteHeader active="Contact" demoHref="#contact-details" />
    <section className="contact-page-hero" aria-labelledby="contact-page-title">
      <video className="contact-hero-video" src="/assets/contact/contact-market-background.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      <div className="contact-page-hero-copy"><p className="course-kicker"><i className="fa-solid fa-id-card" /> Your Smisha journey</p><h1 id="contact-page-title"><span><TextPressure text="Become a Smisha" /></span><strong><TextPressure text="Academy student." minWeight={700} /></strong></h1><p>Start with a conversation. Our team will help you choose a practical path through courses, workshops, and market education.</p></div>
      <aside className="contact-lanyard-stage" aria-label="Smisha Academy student ID card. Drag to interact or tap to turn it over.">
        <Lanyard frontImage="/assets/contact/smisha-student-id-front.svg?v=3" backImage="/assets/contact/smisha-student-id-back.svg" strapImage="/assets/contact/smisha-lanyard-strap.svg" imageFit="cover" cardColor="#f8fbff" orientation="portrait" finish="glossy" cornerRadius={0.3} size={0.59} anchor="right" strapLength={0.5} strapColor="#0b2f75" strapWidth={0.65} metal="silver" gravity={1} damping={0.42} elasticity={0.5} breeze={0.56} interactive intro />
      </aside>
    </section>
    <section className="contact-page-content" id="contact-details" aria-labelledby="contact-details-title">
      <div className="contact-form-slideshow" aria-hidden="true"><span /><span /></div>
      <ContactEnquiryForm />
      <div className="contact-page-details contact-page-details--after-form">
        <div className="contact-details-copy"><p className="section-label">CONNECT WITH US</p><h2 id="contact-details-title">We are here to<br /><strong>help you begin.</strong></h2><p>Share a few details and we will help you find an education path that matches where you are now.</p></div>
        <div className="contact-details-list"><a href="mailto:support@smishasharemarket.com"><i className="fa-regular fa-envelope" aria-hidden="true" /><span><small>EMAIL US</small>support@smishasharemarket.com</span></a><a href="tel:+917420001687"><i className="fa-solid fa-phone" aria-hidden="true" /><span><small>CALL US</small>+91 7420001687</span></a><a href="tel:+917420040030"><i className="fa-solid fa-phone" aria-hidden="true" /><span><small>CALL US</small>+91 7420040030</span></a></div>
        <div className="contact-location-note"><i className="fa-solid fa-location-dot" aria-hidden="true" /><span><b>Visit our Pune academy</b><small>Meet the team and explore how practical market learning works.</small></span></div>
      </div>
    </section>
    <section className="home-location-section contact-location-map-section" aria-labelledby="contact-map-title">
      <div className="home-map-frame"><AcademyMap /><div className="home-map-overlay"><p className="section-kicker">VISIT SMISHA IN PUNE</p><h2 id="contact-map-title"><strong>Learn where market</strong><span>confidence is built.</span></h2><p>Visit the academy, meet the team, and explore practical stock market learning built for real progress.</p><a href="tel:+917420001687">Plan your visit <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a></div></div>
    </section>
    <SiteFooter />
  </main>;
}
