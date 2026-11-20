'use client';
import { useEffect, useState } from 'react';

export default function SiteHeader({ active = '', demoHref = '/#contact', homePattern = true }) {
  const [open, setOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('.site-footer');
    if (!footer || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { rootMargin: '0px 0px 120px 0px', threshold: 0 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return <>
    <div className={`site-topbar course-topbar${homePattern ? ' home-pattern-topbar' : ''}`}>
      {homePattern ? <div className="home-info-strip">
        <div className="home-info-contact"><i className="fa-solid fa-phone-volume" aria-hidden="true" /><a href="tel:+917420001687">+91 74200 01687</a><span>or</span><a href="/contact">Request a call back</a></div>
        <div className="home-info-center"><i className="fa-solid fa-bell" aria-hidden="true" /> Live Market Learning &amp; Mentorship</div>
        <div className="home-info-links"><a href="/library"><i className="fa-solid fa-download" aria-hidden="true" /> Free Trading Guides</a><a href="/contact"><i className="fa-solid fa-headset" aria-hidden="true" /> Help Center</a></div>
      </div> : <div className="topbar-inner"><div className="topbar-contact"><a href="mailto:support@smishasharemarket.com"><i className="fa-regular fa-envelope" />support@smishasharemarket.com</a><a href="tel:+917420001687"><i className="fa-solid fa-phone" />+91 7420001687</a><a href="tel:+917420040030"><i className="fa-solid fa-phone" />+91 7420040030</a></div><div className="topbar-socials"><a href="https://www.instagram.com/smisha_share_market" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a><a href="https://www.youtube.com/@smishasharemarket" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a></div></div>}
    </div>
    <header className={`site-header course-header${homePattern ? ' home-pattern-header' : ''}`}>
      <a className="brand" href="/" aria-label="Smisha Share Market Academy home"><img className="brand-logo" src={homePattern ? '/assets/smisha-logo-navy.png' : '/assets/smisha-logo-dark.png'} alt="Smisha Share Market Classes, Learn. Analyse. Grow." />{!homePattern && <span className="brand-tagline">Share Market Academy</span>}</a>
      <nav id="site-navigation" className={`desktop-nav course-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">{[['Homepage', '/'], ['About Us', '/about'], ['Courses', '/courses'], ['Workshops', '/workshops'], ['Library', '/library'], ['Calculators', '/calculators'], ['Contact', '/contact']].map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className={active === label ? 'active' : ''} aria-current={active === label ? 'page' : undefined}>{label}{homePattern && <span className="home-nav-arrow" aria-hidden="true">↘</span>}</a>)}</nav>
      {homePattern && <div className="home-header-utilities"><i className="fa-solid fa-magnifying-glass home-header-search" aria-hidden="true" /><span aria-hidden="true" /><a className="home-header-support" href="/contact"><i className="fa-solid fa-headset" aria-hidden="true" /><b>Contact Support</b><i className="fa-solid fa-arrow-up-right-from-square home-header-external" aria-hidden="true" /></a></div>}
      <div className="header-actions"><a className="appointment" href={demoHref} aria-label="Book a demo"><span className="glass-button-label" aria-hidden="true"><span>Book a demo</span><span>Start learning</span></span></a><button className={`menu-button${open ? ' is-open' : ''}`} type="button" onClick={() => setOpen(current => !current)} aria-controls="site-navigation" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}><span /><span /></button></div>
    </header>
    <a className={`whatsapp-float${footerVisible ? ' whatsapp-float--above-footer' : ''}`} href="https://wa.me/919595150577" target="_blank" rel="noreferrer" aria-label="Chat with Smisha Share Market on WhatsApp"><i className="fa-brands fa-whatsapp" aria-hidden="true" /><span className="glass-button-label" aria-hidden="true"><span>WhatsApp us</span><span>Chat with us</span></span></a>
  </>;
}
