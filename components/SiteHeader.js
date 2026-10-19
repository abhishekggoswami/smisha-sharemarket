'use client';
import { useEffect, useState } from 'react';

export default function SiteHeader({ active = '', demoHref = '/#contact' }) {
  const [open, setOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('.site-footer');
    if (!footer || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.08 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return <>
    <div className="site-topbar course-topbar"><div className="topbar-inner"><div className="topbar-contact"><a href="mailto:support@smishasharemarket.com"><i className="fa-regular fa-envelope" />support@smishasharemarket.com</a><a href="tel:+917420001687"><i className="fa-solid fa-phone" />+91 7420001687</a><a href="tel:+917420040030"><i className="fa-solid fa-phone" />+91 7420040030</a></div><div className="topbar-socials"><a href="https://www.instagram.com/smisha_share_market" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a><a href="https://www.youtube.com/@smishasharemarket" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a></div></div></div>
    <header className="site-header course-header">
      <a className="brand" href="/" aria-label="Smisha Share Market Academy home"><img className="brand-logo" src="/assets/smisha-academy-wordmark-transparent.png" alt="Smisha" /><span className="brand-tagline">Share Market Academy</span></a>
      <nav id="site-navigation" className={`desktop-nav course-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">{[['Homepage', '/'], ['About Us', '/about'], ['Courses', '/courses'], ['Workshops', '/workshops'], ['Library', '/library'], ['Calculators', '/calculators'], ['Contact', '/contact']].map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className={active === label ? 'active' : ''} aria-current={active === label ? 'page' : undefined}>{label}</a>)}</nav>
      <div className="header-actions"><a className="appointment" href={demoHref}>Book a demo</a><button className={`menu-button${open ? ' is-open' : ''}`} type="button" onClick={() => setOpen(current => !current)} aria-controls="site-navigation" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}><span /><span /></button></div>
    </header>
    <a className={`whatsapp-float${footerVisible ? ' whatsapp-float--above-footer' : ''}`} href="https://wa.me/919595150577" target="_blank" rel="noreferrer" aria-label="Chat with Smisha Share Market on WhatsApp"><i className="fa-brands fa-whatsapp" aria-hidden="true" /><span>WhatsApp us</span></a>
  </>;
}
