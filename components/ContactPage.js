'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AcademyMap from './AcademyMap';
import SiteHeader from './SiteHeader';
import { SiteFooter } from './SharedSiteSections';
import TextPressure from './TextPressure';
import {sendLead} from './LeadCapture';

function ContactBackgroundSlideshow() {
  const slideshowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const slideshow = slideshowRef.current;
    if (!slideshow || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '160px 0px' });
    observer.observe(slideshow);
    return () => observer.disconnect();
  }, []);

  return <div ref={slideshowRef} className={`contact-form-slideshow${isVisible ? ' is-active' : ''}`} aria-hidden="true"><span /><span /></div>;
}

function ContactEnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  async function submit(event){event.preventDefault();setSaving(true);setError('');const d=new FormData(event.currentTarget);try{await sendLead({category:'Contact',form:'Contact page enquiry',name:String(d.get('name')||''),phone:String(d.get('phone')||''),email:String(d.get('email')||''),interest:String(d.get('interest')||''),message:String(d.get('message')||''),consent:d.get('consent')==='yes'});setSubmitted(true)}catch(err){setError(err.message)}finally{setSaving(false)}}

  if (submitted) return <div className="contact-enquiry-success" role="status"><i className="fa-solid fa-circle-check" aria-hidden="true" /><p className="section-label">ENQUIRY RECEIVED</p><h2>Thank you for reaching out.</h2><p>Our Smisha team will connect with you shortly to help you choose your next learning step.</p><button type="button" onClick={() => setSubmitted(false)}>Send another enquiry <i className="fa-solid fa-arrow-right" aria-hidden="true" /></button></div>;

  return <form className="contact-enquiry-form" onSubmit={submit}>
    <div className="contact-form-heading"><div><p className="section-label">START YOUR ENQUIRY</p><h2>Let&apos;s plan your<br /><strong>next market move.</strong></h2></div></div>
    <div className="contact-form-fields">
      <label>Full name<input required name="name" autoComplete="name" placeholder="Enter your name" /></label>
      <label>Phone number<input required name="phone" autoComplete="tel" inputMode="tel" placeholder="Enter your phone number" /></label>
      <label className="contact-form-wide">Email address<input required type="email" name="email" autoComplete="email" placeholder="Enter your email address" /></label>
      <label className="contact-form-wide">What would you like to learn?<input required name="interest" placeholder="e.g. Smart investing, technical analysis, or a workshop" /></label>
      <label className="contact-form-wide">How can we help?<textarea required name="message" rows="4" placeholder="Tell us what you would like to learn" /></label>
    </div>
    <label className="contact-form-wide"><input type="checkbox" name="consent" value="yes" required /> I agree to be contacted by Smisha about my enquiry.</label>
    {error&&<p role="alert" style={{color:'#b42318'}}>{error}</p>}
    <button type="submit" disabled={saving} className="contact-form-submit btn btn-primary"><span className="btn-txt">{saving?'Sending…':'Send enquiry'}</span><kbd className="btn-kbd" aria-hidden="true"><i className="fa-solid fa-arrow-right" /></kbd></button>
    <p className="contact-form-note">No dropdowns, no pressure—just tell us how we can help.</p>
  </form>;
}

export default function ContactPage() {
  const locationSectionRef = useRef(null);

  useEffect(() => {
    const section = locationSectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const map = section.querySelector('.academy-map');
    const card = section.querySelector('.home-map-overlay');
    const actions = section.querySelectorAll('.home-map-actions a');
    if (!map || !card) return undefined;

    let timeline;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const compactMotion = window.matchMedia('(max-width: 640px)').matches;
      timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo(map, { autoAlpha: 0, scale: compactMotion ? 1.018 : 1.035 }, { autoAlpha: 1, duration: compactMotion ? .65 : .85, scale: 1 })
        .fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: .58 }, '-=.38')
        .fromTo(actions, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, duration: .38, stagger: .09, y: 0 }, '-=.2');
    }, { rootMargin: '120px 0px', threshold: .14 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      timeline?.kill();
    };
  }, []);

  return <main className="course-shell contact-page-shell">
    <SiteHeader active="Contact" demoHref="#contact-details" />
    <section className="contact-page-hero" aria-labelledby="contact-page-title">
      <video className="contact-hero-video" src="/assets/contact/contact-market-background.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      <div className="contact-page-hero-copy"><p className="course-kicker"><i className="fa-solid fa-id-card" /> Your Smisha journey</p><h1 id="contact-page-title"><span><TextPressure text="Become a Smisha" /></span><strong><TextPressure text="Academy student." minWeight={700} /></strong></h1><p>Start with a conversation. Our team will help you choose a practical path through courses, workshops, and market education.</p></div>
      <aside className="contact-lanyard-stage" aria-label="Smisha Academy student ID card">
        <div className="contact-id-drop" aria-hidden="true">
          <div className="contact-id-strap" />
          <div className="contact-id-clasp"><i /></div>
          <div className="contact-id-card">
            <img src="/assets/contact/smisha-student-id-front.svg?v=8" alt="" decoding="sync" fetchPriority="high" />
            <span className="contact-id-sheen" />
          </div>
        </div>
      </aside>
    </section>
    <section className="contact-page-content" id="contact-details" aria-labelledby="contact-details-title">
      <ContactBackgroundSlideshow />
      <ContactEnquiryForm />
      <div className="contact-page-details contact-page-details--after-form">
        <div className="contact-details-copy"><p className="section-label">CONNECT WITH US</p><h2 id="contact-details-title">We are here to<br /><strong>help you begin.</strong></h2><p>Share a few details and we will help you find an education path that matches where you are now.</p></div>
        <div className="contact-details-list"><a href="mailto:support@smishasharemarket.com"><i className="fa-regular fa-envelope" aria-hidden="true" /><span><small>EMAIL US</small>support@smishasharemarket.com</span></a><a href="tel:+917420001687"><i className="fa-solid fa-phone" aria-hidden="true" /><span><small>CALL US</small>+91 7420001687</span></a><a href="tel:+917420040030"><i className="fa-solid fa-phone" aria-hidden="true" /><span><small>CALL US</small>+91 7420040030</span></a></div>
        <div className="contact-location-note"><i className="fa-solid fa-location-dot" aria-hidden="true" /><span><b>Visit our Pune academy</b><small>Meet the team and explore how practical market learning works.</small></span></div>
      </div>
    </section>
    <section ref={locationSectionRef} className="home-location-section contact-location-map-section" aria-labelledby="contact-map-title">
      <div className="home-map-frame"><AcademyMap /><div className="home-map-overlay"><p className="section-kicker">VISIT SMISHA IN PUNE</p><h2 id="contact-map-title"><strong>Learn where market</strong><span>confidence is built.</span></h2><p>Visit the academy, meet the team, and explore practical stock market learning built for real progress.</p><div className="home-map-actions"><a className="home-map-primary" href="https://www.google.com/maps/dir/?api=1&destination=18.5564578%2C73.955024" target="_blank" rel="noopener noreferrer" aria-label="Plan your visit with Google Maps directions">Plan Your Visit <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a><a className="home-map-satellite" href="https://www.google.com/maps/@?api=1&map_action=map&center=18.5564578%2C73.955024&zoom=18&basemap=satellite" target="_blank" rel="noopener noreferrer" aria-label="Explore Smisha Academy in satellite view on Google Maps"><i className="fa-solid fa-satellite-dish" aria-hidden="true" />Explore Satellite View</a></div></div></div>
    </section>
    <SiteFooter />
  </main>;
}
