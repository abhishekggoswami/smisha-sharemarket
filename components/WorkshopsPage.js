'use client';

import { useEffect, useRef, useState } from 'react';
import SiteHeader from './SiteHeader';
import { SiteFAQ, SiteFooter } from './SharedSiteSections';
import { pastWorkshops, upcomingWorkshops } from '../lib/workshops';
import './workshops.css';

const tabs = [['upcoming', 'Upcoming workshops', 'calendar-days'], ['past', 'Past workshops', 'images'], ['host', 'Conduct a workshop', 'building']];
const arrow = <i className="fa-solid fa-arrow-right" aria-hidden="true" />;

function Countdown({ date }) {
  const [remaining, setRemaining] = useState(null);
  useEffect(() => { const tick = () => setRemaining(Math.max(0, new Date(date).getTime() - Date.now())); tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer); }, [date]);
  return <div className="ws-countdown" aria-label="Time until workshop">{[['Days', 86400000], ['Hours', 3600000], ['Mins', 60000], ['Secs', 1000]].map(([label, unit], i) => <div key={label}><b>{remaining === null ? '—' : String(Math.floor(remaining / unit) % (i === 0 ? Infinity : i === 1 ? 24 : 60)).padStart(2, '0')}</b><small>{label}</small></div>)}</div>;
}

function Field({ label, name, type = 'text', children, required = true, ...props }) {
  return <label className={`ws-field ${name === 'message' ? 'ws-wide' : ''}`}><span>{label}{required && <em> *</em>}</span>{children ? <select name={name} required={required} defaultValue="" {...props}><option value="" disabled>Select an option</option>{children}</select> : type === 'textarea' ? <textarea name={name} required={required} rows={4} maxLength={3000} {...props} /> : <input name={name} type={type} required={required} maxLength={200} {...props} />}</label>;
}

function EnquiryForm({ kind = 'host', event, onRegistered }) {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const host = kind === 'host';
  async function submit(e) {
    e.preventDefault(); setStatus('sending'); setError('');
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await fetch('/api/workshops', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, kind, workshopId: event?.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to send. Please try again.');
      setReference(result.reference); setStatus('success'); onRegistered?.();
    } catch (err) { setError(err.message); setStatus(''); }
  }
  if (status === 'success') return <div className="ws-success" role="status"><i className="fa-solid fa-circle-check" /><p className="section-label">{host ? 'REQUEST RECEIVED' : kind === 'register' ? 'REGISTRATION RECEIVED' : 'YOU’RE ON THE LIST'}</p><h3>{host ? 'A great session starts here.' : 'Your next learning step is closer.'}</h3><p>{kind === 'register' ? `Your registration for ${event.title} has been saved.` : host ? 'Your workshop brief has been saved for the Smisha team to review.' : 'Your interest has been saved. Dates and availability will be shared once confirmed.'}</p><small>Reference: {reference}</small><button className="ws-text-button" onClick={() => setStatus('')}>Submit another enquiry {arrow}</button></div>;
  return <form className="ws-form" onSubmit={submit}>
    <div className="ws-form-title"><span>{host ? 'YOUR WORKSHOP BRIEF' : kind === 'register' ? 'RESERVE YOUR PLACE' : 'BE FIRST TO KNOW'}</span><small>* Required fields</small></div>
    <div className="ws-fields">
      <Field label="Your name" name="name" placeholder="Full name" autoComplete="name" />
      <Field label="Email address" name="email" type="email" placeholder={host ? 'you@company.com' : 'you@example.com'} autoComplete="email" />
      <Field label="Phone number" name="phone" type="tel" placeholder="+91" autoComplete="tel" pattern="[+0-9 ()-]{7,20}" />
      {host ? <><Field label="Company / institution name" name="company" placeholder="Your organisation’s name" autoComplete="organization" /><Field label="Organization type" name="organization">{['Company / corporate', 'College / university', 'Community / association', 'Other'].map(x => <option key={x}>{x}</option>)}</Field><Field label="Number of participants" name="participants" type="number" min="1" max="100000" placeholder="e.g. 50" /><Field label="City" name="city" placeholder="Where shall we meet?" autoComplete="address-level2" /><Field label="Preferred date" name="date" type="date" min={new Date().toLocaleDateString('en-CA')} /><Field label="Estimated budget" name="budget">{['Under ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000+', 'Let’s discuss'].map(x => <option key={x}>{x}</option>)}</Field><Field label="Workshop format" name="format">{['At your venue', 'Online', 'Let’s decide together'].map(x => <option key={x}>{x}</option>)}</Field><Field label="What would you like your team to learn?" name="message" type="textarea" required={false} placeholder="Tell us about your audience, learning goals, and anything else we should know…" /></> : <Field label="City" name="city" placeholder="Your city" autoComplete="address-level2" />}
    </div>
    <label className="ws-consent"><input type="checkbox" name="consent" required value="yes" /> <span>I agree to be contacted by Smisha about this {host ? 'workshop request' : kind === 'register' ? 'registration' : 'workshop interest'}.</span></label>
    {error && <p className="ws-error" role="alert">{error}</p>}
    <button className="course-primary-button ws-submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : host ? 'Send workshop request' : kind === 'register' ? 'Confirm registration' : 'Keep me updated'} {arrow}</button>
    <p className="ws-form-note">{host ? 'An enquiry, not a commitment. We’ll work out the details together.' : kind === 'register' ? 'Please use an email address we can reach you at.' : 'Register your interest. This does not reserve a seat.'}</p>
  </form>;
}

export default function WorkshopsPage() {
  const [tab, setTab] = useState('upcoming');
  const [gallery, setGallery] = useState('Photos');
  const [pastId, setPastId] = useState(pastWorkshops[0]?.id);
  const [photo, setPhoto] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [availability, setAvailability] = useState({});
  const dialog = useRef(null);
  const panel = useRef(null);
  const past = pastWorkshops.slice(0, 10).find(w => w.id === pastId);
  function refreshAvailability() { fetch('/api/workshops').then(r => r.ok ? r.json() : Promise.reject()).then(setAvailability).catch(() => setAvailability({})); }
  useEffect(() => { const sync = () => { const hash = location.hash.slice(1); if (tabs.some(([id]) => id === hash)) setTab(hash); }; sync(); window.addEventListener('hashchange', sync); refreshAvailability(); const timer = setInterval(refreshAvailability, 30000); return () => { window.removeEventListener('hashchange', sync); clearInterval(timer); }; }, []);
  useEffect(() => { if (photo !== null || registration) { dialog.current?.showModal(); const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = old; }; } dialog.current?.close(); }, [photo, registration]);
  function selectTab(id, scroll = false) { setTab(id); history.replaceState(null, '', `#${id}`); if (scroll) panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function closeDialog() { setPhoto(null); setRegistration(null); }
  return <main className="course-shell ws-shell">
    <SiteHeader active="Workshops" />
    <section className="course-hero ws-hero"><div className="course-hero-ring ring-one" /><div className="course-hero-ring ring-two" /><div className="course-hero-grid" /><div className="course-hero-content"><p className="course-kicker">LEARN TOGETHER. GROW TOGETHER.</p><h1>Beyond the charts.<br /><strong>Into the real world.</strong></h1><p className="course-hero-copy">Fresh perspectives. Practical market knowledge. A room full of possibilities. Experience learning, the Smisha way.</p><div className="course-hero-actions"><button className="course-primary-button" onClick={() => selectTab('upcoming', true)}>Explore workshops <i className="fa-solid fa-arrow-down" /></button><button className="course-text-link ws-hero-link" onClick={() => selectTab('host', true)}>Bring Smisha to your team {arrow}</button></div></div><aside className="ws-hero-photo"><img src="/assets/workshops/pic7.webp" alt="A Smisha stock-market workshop in progress" /><div><span><i className="fa-solid fa-circle" /> THE SMISHA EXPERIENCE</span><p>Real conversations.<br /><b>Lasting knowledge.</b></p></div><small>IIEBM · July 2025 <i className="fa-solid fa-arrow-up-right-from-square" /></small></aside></section>
    <div className="ws-body" ref={panel}>
      <div className="ws-tabs" role="tablist" aria-label="Explore workshops">{tabs.map(([id, label, icon], index) => <button key={id} id={`tab-${id}`} role="tab" aria-selected={tab === id} aria-controls={`panel-${id}`} tabIndex={tab === id ? 0 : -1} onClick={() => selectTab(id)} onKeyDown={e => { const next = e.key === 'ArrowRight' ? (index + 1) % 3 : e.key === 'ArrowLeft' ? (index + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1; if (next >= 0) { e.preventDefault(); selectTab(tabs[next][0]); document.getElementById(`tab-${tabs[next][0]}`).focus(); } }}><i className={`fa-regular fa-${icon}`} aria-hidden="true" /><span>{label}</span><small>0{index + 1}</small></button>)}</div>
      <section className="ws-panel" id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
        {tab === 'upcoming' && <><div className="ws-heading"><div><p className="section-label">YOUR NEXT LEARNING EXPERIENCE</p><h2>Make room for<br /><strong>a new perspective.</strong></h2></div><p>Join a focused session, ask your questions, and take practical market knowledge home with you.</p></div>
          {upcomingWorkshops.filter(w => new Date(w.startsAt).getTime() > Date.now()).length ? <div className="ws-events">{upcomingWorkshops.filter(w => new Date(w.startsAt).getTime() > Date.now()).map(event => <article className="ws-event" key={event.id}><p className="section-label">UPCOMING WORKSHOP</p><h3>{event.title}</h3><p>{event.description}</p><p>{new Date(event.startsAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST · {event.location}</p><Countdown date={event.startsAt} /><p>{availability[event.id] === undefined ? 'Checking seat availability…' : `${availability[event.id]} of ${event.capacity} seats available`}</p><button className="course-primary-button" disabled={!availability[event.id]} onClick={() => setRegistration(event)}>{availability[event.id] === 0 ? 'Fully booked' : 'Register now'} {arrow}</button></article>)}</div> : <div className="ws-upcoming"><div className="ws-announcement"><span className="ws-chip"><span /> NEXT CHAPTER, COMING SOON</span><div className="ws-calendar-art" aria-hidden="true"><span>SMISHA WORKSHOPS</span><i className="fa-regular fa-calendar-check" /><b>Something worth<br />showing up for.</b></div><h3>Good things are<br />in the planning.</h3><p>Our next workshop dates will be announced here. Leave your details to express interest in the next session.</p><div className="ws-mini-features"><span><i className="fa-solid fa-comments" /> Interactive learning</span><span><i className="fa-solid fa-chart-line" /> Practical concepts</span></div></div><EnquiryForm kind="interest" /></div>}
          <button className="ws-bottom-link" onClick={() => selectTab('past')}>A glimpse of what learning together looks like <span>Explore past workshops {arrow}</span></button></>}
        {tab === 'past' && <><div className="ws-heading"><div><p className="section-label">MOMENTS THAT MAKE A DIFFERENCE</p><h2>The learning lives on.<br /><strong>Step inside our workshops.</strong></h2></div><p>A closer look at the people, conversations, and ideas behind our sessions.</p></div>{past ? <>
          {pastWorkshops.length > 1 && <label className="ws-archive-select">Choose a workshop <select value={pastId} onChange={e => { setPastId(e.target.value); setGallery('Photos'); }}>{pastWorkshops.slice(0, 10).map(w => <option value={w.id} key={w.id}>{w.organization} · {w.date}</option>)}</select></label>}
          <article className="ws-past-feature"><button className="ws-cover" onClick={() => setPhoto(0)} aria-label="Open workshop photo gallery"><img src={past.photos[0].src} alt={past.photos[0].alt} /><span><i className="fa-solid fa-expand" /> View gallery</span></button><div className="ws-past-copy"><span className="ws-chip">PAST WORKSHOP · {past.date}</span><h3>{past.title}</h3><p>{past.description}</p><div className="ws-event-meta"><span><i className="fa-regular fa-building" /> {past.organization}</span><span><i className="fa-regular fa-user" /> Led by {past.speaker}</span></div></div></article>
          <div className="ws-gallery-tabs" aria-label="Workshop resources">{['Photos', 'Videos', 'Highlights', 'Certificates', 'Testimonials'].map(name => <button key={name} aria-pressed={gallery === name} onClick={() => setGallery(name)}>{name}{name === 'Photos' && <small>{past.photos.length}</small>}</button>)}</div>
          {gallery === 'Photos' ? <div className="ws-photo-grid">{past.photos.map((item, i) => <button key={item.src} onClick={() => setPhoto(i)} aria-label={`Enlarge photo ${i + 1}: ${item.alt}`}><img src={item.src} alt={item.alt} loading="lazy" /><span>0{i + 1} <i className="fa-solid fa-expand" /></span></button>)}</div> : gallery === 'Highlights' ? <div className="ws-highlights">{past.highlights.map((text, i) => <article key={text}><span>0{i + 1}</span><h3>{text}</h3></article>)}</div> : (past[gallery.toLowerCase()] || []).length ? <div className="ws-resources">{past[gallery.toLowerCase()].map((item, i) => gallery === 'Videos' ? <video key={i} controls preload="metadata" src={item.src} aria-label={item.title} /> : gallery === 'Certificates' ? <a key={i} href={item.src} target="_blank" rel="noreferrer">{item.title} {arrow}</a> : <blockquote key={i}><p>{item.quote}</p><cite>{item.name}</cite></blockquote>)}</div> : <div className="ws-resource-empty"><i className={`fa-regular fa-${gallery === 'Videos' ? 'circle-play' : gallery === 'Certificates' ? 'file-lines' : 'comment'}`} /><h3>{gallery === 'Videos' ? 'The moments, in motion.' : gallery === 'Certificates' ? 'A record of your learning.' : 'In our participants’ words.'}</h3><p>{gallery === 'Videos' ? 'No video has been published for this workshop yet. Explore the photo gallery for a look inside.' : gallery === 'Certificates' ? 'Certificates are not publicly listed. If you attended, contact our team about your certificate.' : 'Participant testimonials have not been published for this workshop yet.'}</p>{gallery === 'Certificates' && <a href="mailto:support@smishasharemarket.com?subject=Workshop%20certificate%20enquiry">Enquire about a certificate {arrow}</a>}</div>}
        </> : <div className="ws-resource-empty"><h3>Our workshop archive is coming soon.</h3><p>Photos and highlights will appear here after our sessions.</p></div>}</>}
        {tab === 'host' && <><div className="ws-heading"><div><p className="section-label">FOR COMPANIES, CAMPUSES & COMMUNITIES</p><h2>Your people. Our expertise.<br /><strong>A world of possibilities.</strong></h2></div><p>Bring practical financial education to your organisation, with a session shaped around your people.</p></div><div className="ws-host-layout"><aside className="ws-host-story"><span className="ws-chip">LET’S CREATE SOMETHING VALUABLE</span><h3>A smarter conversation<br />starts in your workplace.</h3><p>From the first market question to a deeper understanding of investing, make learning a shared experience.</p><div className="ws-host-benefits">{[['01', 'Built around your audience', 'A conversation about your goals, experience level, and learning needs.'], ['02', 'A format that fits', 'Discuss an in-person session at your venue or an online workshop.'], ['03', 'Practical by design', 'Clear concepts, relatable examples, and space for questions.']].map(([n, title, copy]) => <div key={n}><b>{n}</b><div><h4>{title}</h4><p>{copy}</p></div></div>)}</div><img src="/assets/workshops/smisha-pic-1.webp" alt="Students learning together at a Smisha workshop" loading="lazy" /><div className="ws-host-contact"><span>Prefer a conversation?</span><a href="tel:+917420001687">+91 7420001687 {arrow}</a></div></aside><EnquiryForm /></div></>}
      </section>
    </div>
    <SiteFAQ /><SiteFooter />
    <dialog ref={dialog} aria-label={registration ? `Register for ${registration.title}` : 'Workshop photo gallery'} className={`ws-dialog ${registration ? 'ws-registration-dialog' : ''}`} onCancel={closeDialog} onClick={e => { if (e.target === e.currentTarget) closeDialog(); }}><button autoFocus className="ws-dialog-close" onClick={closeDialog} aria-label="Close dialog">×</button>{photo !== null && past && <div className="ws-lightbox"><img src={past.photos[photo].src} alt={past.photos[photo].alt} /><div><button onClick={() => setPhoto((photo + past.photos.length - 1) % past.photos.length)} aria-label="Previous photo">←</button><p>{photo + 1} / {past.photos.length} · {past.photos[photo].alt}</p><button onClick={() => setPhoto((photo + 1) % past.photos.length)} aria-label="Next photo">→</button></div></div>}{registration && <><h2 id="registration-title">{registration.title}</h2><EnquiryForm key={registration.id} kind="register" event={registration} onRegistered={refreshAvailability} /></>}</dialog>
  </main>;
}
