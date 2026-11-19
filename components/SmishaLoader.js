'use client';

import { useEffect, useState } from 'react';
import './SmishaLoader.css';

const DIR = '/assets/smisha-loader';
const DURATION = 3040;
const pieces = ['bar-1', 'bar-2', 'bar-3', 'bar-4', 'bull', 'wordmark', 'subtitle', 'tagline'];

export default function SmishaLoader() {
  const [phase, setPhase] = useState('playing');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (reduced) setPhase('reduced');
    // CSS drives the exit on the compositor; React only removes its invisible overlay.
    // A delayed main-thread timer therefore cannot visibly prolong the transition.
    const finish = window.setTimeout(() => setPhase('done'), reduced ? 500 : DURATION);
    const safeguard = window.setTimeout(() => setPhase('done'), 4500);
    return () => {
      window.clearTimeout(finish);
      window.clearTimeout(safeguard);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      document.body.style.overflow = '';
      window.__SMISHA_LOADER_COMPLETE__ = true;
      window.dispatchEvent(new Event('smisha-loader-complete'));
    }
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className={`smisha-loader smisha-loader--${phase}`} role="status" aria-label="Loading Smisha Share Market Classes">
      <div className="smisha-loader__ambient" aria-hidden="true" />
      <div className="smisha-loader__market" aria-hidden="true">
        <svg viewBox="0 0 1200 420" preserveAspectRatio="none">
          <defs>
            <linearGradient id="smisha-market-line" x1="0" x2="1">
              <stop stopColor="#ff572d" stopOpacity="0"/>
              <stop offset=".55" stopColor="#f6b756" stopOpacity=".48"/>
              <stop offset="1" stopColor="#ff572d" stopOpacity=".1"/>
            </linearGradient>
          </defs>
          <path className="smisha-loader__market-path" d="M0 320 L100 295 L168 303 L245 236 L295 248 L353 190 L413 220 L485 176 L548 196 L605 124 L666 146 L720 108 L784 143 L840 87 L902 103 L960 66 L1025 92 L1090 31 L1200 65" fill="none" stroke="url(#smisha-market-line)" strokeWidth="2"/>
        </svg>
      </div>
      <div className="smisha-loader__orbital" aria-hidden="true" />
      <div className="smisha-loader__art" role="img" aria-label="Smisha Share Market Classes. Learn. Analyse. Grow.">
        {pieces.map((part) => (
          <img key={part} className={`smisha-loader__piece smisha-loader__${part}`}
            src={`${DIR}/${part}.png`} width="1371" height="1148"
            alt="" draggable="false" decoding="async" />
        ))}
        <img className="smisha-loader__final" src={`${DIR}/original-logo.png`}
          width="1371" height="1148" alt="" draggable="false" decoding="async" />
        <div className="smisha-loader__shine" aria-hidden="true" />
      </div>
      <div className="smisha-loader__footer" aria-hidden="true">
        <span className="smisha-loader__footer-line" />
        <span className="smisha-loader__footer-dot" />
        <span className="smisha-loader__footer-line" />
      </div>
      <button type="button" className="smisha-loader__skip" onClick={() => setPhase('done')}>
        Skip intro <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
