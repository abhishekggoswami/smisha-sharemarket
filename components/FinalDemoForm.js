'use client';

import { useEffect, useRef, useState } from 'react';
import { sendLead } from './LeadCapture';

export default function FinalDemoForm({ initialOpen = false }) {
  const [view, setView] = useState(initialOpen ? 'form' : 'intro');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const nameRef = useRef(null);
  const introButtonRef = useRef(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (view === 'form') nameRef.current?.focus();
    if (view === 'intro' && returnFocus.current) {
      introButtonRef.current?.focus();
      returnFocus.current = false;
    }
  }, [view]);

  const goBack = () => {
    returnFocus.current = true;
    setError('');
    setStatus('');
    setView('intro');
  };

  async function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setStatus('saving');
    setError('');
    try {
      await sendLead({
        category: 'Consultation', form: 'Homepage conversation CTA',
        name: String(fields.get('name') || ''), phone: String(fields.get('phone') || ''),
        email: String(fields.get('email') || ''), interest: String(fields.get('interest') || ''),
        website: String(fields.get('website') || ''), consent: fields.get('consent') === 'yes',
      });
      setStatus('success');
    } catch (err) {
      setStatus('');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (view === 'intro') return <>
    <div className="final-demo-card">
      <div className="final-demo-avatars" aria-hidden="true">
        <img src="/assets/students/student-1.jpeg" alt="" loading="lazy" decoding="async" />
        <img src="/assets/students/student-2.jpeg" alt="" loading="lazy" decoding="async" />
        <img src="/assets/students/student-3.jpeg" alt="" loading="lazy" decoding="async" />
      </div>
      <h2 id="final-demo-title">Get tomorrow&apos;s<br /><span>competitive <em className="heading-gold">edge</em> today</span></h2>
      <p className="final-demo-copy">Start with a free demo and discover a practical learning path built around your market goals.</p>
      <button type="button" className="final-demo-button" ref={introButtonRef} onClick={() => setView('form')}>Let&apos;s Start a Conversation <i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
    </div>
    <div className="final-demo-partners" aria-label="Market platform partners">
      <p>Trusted by learners · Connected with leading market platforms</p>
      <div className="final-demo-logos"><img src="/assets/about/angel-one-logo.webp" alt="Angel One" loading="lazy" decoding="async" /><img src="/assets/about/dhan-logo.webp" alt="Dhan" loading="lazy" decoding="async" /></div>
    </div>
  </>;

  return <div className="final-demo-form-panel">
    <button className="final-demo-back" type="button" onClick={goBack} disabled={status === 'saving'}><i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back</button>
    <p className="final-demo-form-kicker">LET&apos;S START A CONVERSATION</p>
    <h2 id="final-demo-title">Your <em className="heading-gold">next step</em> starts here.</h2>
    {status === 'success' ? <div className="final-demo-success" role="status"><strong>Thank you for reaching out.</strong><p>Your request has been recorded. The Smisha team will be in touch.</p><button type="button" className="final-demo-button" onClick={goBack}>Done</button></div> : <>
      <p className="final-demo-form-intro">Tell us a little about yourself and we&apos;ll help you find the right learning path.</p>
      <form className="final-demo-form" onSubmit={submit}>
        <div className="final-demo-fields">
          <label>Your name<input ref={nameRef} name="name" required minLength="2" maxLength="100" autoComplete="name" placeholder="Your name" /></label>
          <label>Phone number<input name="phone" type="tel" required maxLength="30" autoComplete="tel" inputMode="tel" placeholder="Your phone number" /></label>
          <label>Email (optional)<input name="email" type="email" maxLength="300" autoComplete="email" placeholder="Your email address" /></label>
          <label>What would you like to learn? (optional)<input name="interest" maxLength="300" placeholder="Courses, trading, investing…" /></label>
        </div>
        <label className="final-demo-consent"><input type="checkbox" name="consent" value="yes" required /><span>I agree to be contacted by Smisha regarding this request.</span></label>
        <input className="lead-trap" name="website" tabIndex="-1" aria-hidden="true" autoComplete="off" />
        {error && <p className="final-demo-error" role="alert">{error} <a href="tel:+917420001687">Call us</a></p>}
        <button type="submit" className="final-demo-button" disabled={status === 'saving'}>{status === 'saving' ? 'Sending…' : 'Request a conversation'} <i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
      </form>
    </>}
  </div>;
}
