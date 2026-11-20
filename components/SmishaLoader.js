'use client';

import { useEffect, useRef, useState } from 'react';
import './SmishaLoader.css';

const DIR = '/assets/smisha-loader';
const DURATION = 3500;
const logoPieces = ['bar-1', 'bar-2', 'bar-3', 'bar-4', 'bull', 'wordmark', 'subtitle', 'tagline'];
// Decorative price movement, not real market data.
const chartCloses = [405, 384, 368, 382, 410, 432, 414, 390, 363, 374, 348, 320, 336, 365, 386, 367, 341, 352, 323, 299, 312, 341, 358, 337, 306, 279, 296, 273, 255];

export default function SmishaLoader() {
  const [phase, setPhase] = useState('playing');
  const previousOverflow = useRef('');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const originalOverflow = document.body.style.overflow;
    previousOverflow.current = originalOverflow;
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
      document.body.style.overflow = previousOverflow.current;
      window.__SMISHA_LOADER_COMPLETE__ = true;
      window.dispatchEvent(new Event('smisha-loader-complete'));
    }
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className={`smisha-loader smisha-loader--${phase}`} role="status" aria-label="Loading Smisha Share Market Classes">
      <div className="smisha-intro__ambient" aria-hidden="true" />
      <div className="smisha-intro__grid" aria-hidden="true" />
      <div className="smisha-intro__topline" aria-hidden="true"><span>SMISHA SHARE MARKET</span><span>PUNE, INDIA</span></div>
      <div className="smisha-intro__chart" aria-hidden="true">
        <svg viewBox="0 0 1440 600" preserveAspectRatio="none">
          {chartCloses.map((close, index) => {
            const open = index ? chartCloses[index - 1] : 420;
            const top = Math.min(open, close);
            const bottom = Math.max(open, close);
            return <g key={index} className={`smisha-intro__candle ${close < open ? 'is-rising' : 'is-falling'}`} style={{ animationDelay: `${0.12 + index * 0.065}s` }}>
              <line x1={index * 50 + 20} x2={index * 50 + 20} y1={top - 9 - index % 4 * 3} y2={bottom + 10 + index % 3 * 4} />
              <rect x={index * 50 + 14} y={top} width="12" height={Math.max(5, bottom - top)} rx="1" />
            </g>;
          })}
        </svg>
      </div>
      <div className="smisha-intro__center">
        <div className="smisha-intro__rings" aria-hidden="true"><span /><span /><span /></div>
        <div className="smisha-intro__logo" role="img" aria-label="Smisha Share Market Classes. Learn. Analyse. Grow.">
          {logoPieces.map(part => <img key={part} className={`smisha-intro__piece smisha-intro__piece--${part}`} src={`${DIR}/${part}.png`} width="1371" height="1148" alt="" draggable="false" />)}
          <img className="smisha-intro__logo-static" src={`${DIR}/original-logo.png`} width="1371" height="1148" alt="" draggable="false" />
          <div className="smisha-intro__light" aria-hidden="true" />
        </div>
        <div className="smisha-intro__signature" aria-hidden="true"><span>KNOWLEDGE</span><i /><span>DISCIPLINE</span><i /><span>GROWTH</span></div>
      </div>
      <div className="smisha-intro__bottom" aria-hidden="true"><span>PREPARING YOUR EXPERIENCE</span><div className="smisha-intro__track"><span /></div><span>EST. IN PUNE</span></div>
      <button type="button" className="smisha-loader__skip" onClick={() => setPhase('done')}>
        Skip intro <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
