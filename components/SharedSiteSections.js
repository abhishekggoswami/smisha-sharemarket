'use client';

import { useState } from 'react';

const questions = [
  ['Are your stock market courses suitable for beginners?', 'Yes. We begin with clear fundamentals and build step by step, so you can learn with confidence even if you are completely new to the market.'],
  ['Do you provide live market sessions?', 'Yes. Our learning experience includes practical chart discussions and live-market guidance to help you connect concepts with real trading situations.'],
  ['Which markets and strategies can I learn?', 'You can learn equity, derivatives, forex, and crypto concepts along with technical analysis, risk management, and trading psychology.'],
  ['Are the classes available online and offline?', 'Yes. Smisha Share Market offers flexible learning options so you can choose the format that best fits your schedule and learning style.'],
  ['Will I receive mentorship after joining?', 'Yes. You receive continued guidance, doubt support, and practical feedback to help you improve your market understanding and build disciplined trading habits.'],
];

export function SiteFAQ() {
  const [activeQuestion, setActiveQuestion] = useState(4);
  return <section className="faq-section" id="faq" aria-labelledby="faq-title">
    <div className="faq-heading"><div><p className="section-kicker">Frequently Asked, Clearly Answered</p><h2 id="faq-title"><strong>Everything You Need To Know</strong><span>Before Getting Started</span></h2></div><a className="faq-all-link" href="#contact">All Questions Answered <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a></div>
    <div className="faq-layout"><div className="faq-list">{questions.map(([question, answer], index) => <details className="faq-item" key={question} open={activeQuestion === index} onToggle={(event) => event.currentTarget.open && setActiveQuestion(index)}><summary>{question}</summary><p>{answer}</p></details>)}</div><aside className="faq-help-card"><span className="faq-help-icon" aria-hidden="true"><i className="fa-solid fa-question" /></span><h3>Don&apos;t Worry — We&apos;ve Got Answers!</h3><p>Need help choosing the right course or have a question that isn&apos;t listed here? Our team is ready to guide you.</p><a href="mailto:support@smishasharemarket.com">Ask a Question <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a></aside></div>
  </section>;
}

export function SiteFooter() {
  return <footer className="site-footer" id="contact">
    <div className="footer-contact-strip"><span className="footer-ring ring-a" aria-hidden="true" /><span className="footer-ring ring-b" aria-hidden="true" /><span className="footer-ring ring-c" aria-hidden="true" /><p>Ready to start your trading journey?</p><a href="mailto:support@smishasharemarket.com"><span className="footer-mail-icon"><i className="fa-regular fa-envelope" aria-hidden="true" /></span><span><small>Send us an email</small>support@smishasharemarket.com</span></a></div>
    <div className="footer-main"><section className="footer-brand" aria-label="Smisha Share Market"><a className="footer-logo" href="/"><img src="/assets/smisha-logo.png" alt="Smisha Share Market Classes" /><span>SMISHA <small>SHARE MARKET</small></span></a><p>Practical stock market education built around knowledge, discipline, and real trading confidence.</p><div className="footer-socials" aria-label="Social media links"><a href="https://www.facebook.com/SmishaShareMarketClasses" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a><a href="https://www.instagram.com/smisha_share_market" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a><a href="https://t.me/smishasharemarket" aria-label="Telegram"><i className="fa-brands fa-telegram" /></a><a href="https://www.youtube.com/@smishasharemarket" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a></div></section><section className="footer-links"><h2>Academy</h2><a href="/#about">About Us</a><a href="/courses">Courses</a><a href="/#services">Our Programs</a><a href="/#stories">Student Stories</a><a href="/#process">How It Works</a></section><section className="footer-links"><h2>Learning Paths</h2><a href="/courses">Equity Trading</a><a href="/courses">Technical Analysis</a><a href="/courses">Risk Management</a><a href="/courses">Trading Psychology</a><a href="#faq">FAQs</a></section><section className="footer-newsletter"><h2>Newsletter</h2><p>Get market-learning tips and academy updates.</p><div className="newsletter-input"><input type="email" aria-label="Email address" placeholder="Enter your email" /><button type="button" aria-label="Subscribe"><i className="fa-solid fa-arrow-right" /></button></div><small><i className="fa-regular fa-bell" aria-hidden="true" /> No spam—just useful trading insights.</small></section></div>
    <div className="footer-bottom"><p>© 2026 Smisha Share Market Classes. All rights reserved.</p><div><a href="/">Terms &amp; Conditions</a><a href="/">Privacy Policy</a><a href="/">Legal</a></div></div>
  </footer>;
}
