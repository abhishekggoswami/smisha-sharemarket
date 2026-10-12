'use client';

import { useEffect, useRef, useState } from 'react';

const KEYS = [
  ['MC', 'clear', 'utility'], ['M+', 'memory', 'utility'], ['÷', 'operator', 'utility'], ['×', 'operator', 'utility'],
  ['7', 'number', 'number'], ['8', 'number', 'number'], ['9', 'number', 'number'], ['−', 'operator', 'operator'],
  ['4', 'number', 'number'], ['5', 'number', 'number'], ['6', 'number', 'number'], ['+', 'operator', 'operator'],
  ['1', 'number', 'number'], ['2', 'number', 'number'], ['3', 'number', 'number'], ['=', 'equals', 'equals'],
  ['0', 'number', 'number wide'], ['.', 'decimal', 'number'],
];

const operator = (value) => ({ '÷': '/', '×': '*', '−': '-', '+': '+' }[value] || value);
const formatResult = (value) => {
  if (!Number.isFinite(value)) return 'Error';
  return String(Number.parseFloat(value.toFixed(10)));
};

function solve(expression) {
  if (!expression || !/^[0-9+\-*/.() ]+$/.test(expression)) return null;
  try {
    const result = Function(`"use strict"; return (${expression})`)();
    return Number.isFinite(result) ? formatResult(result) : 'Error';
  } catch {
    return 'Error';
  }
}

export default function Hero3DCalculator() {
  const deviceRef = useRef(null);
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('financial calculators');
  const [memory, setMemory] = useState(0);
  const [pressed, setPressed] = useState('');

  const press = (label, type) => {
    if (type === 'clear') {
      setExpression('');
      setDisplay('financial calculators');
      return;
    }
    if (type === 'memory') {
      const value = solve(expression);
      if (value && value !== 'Error') {
        const nextMemory = memory + Number(value);
        setMemory(nextMemory);
        setDisplay(`M ${formatResult(nextMemory)}`);
      }
      return;
    }
    if (type === 'equals') {
      const answer = solve(expression);
      if (answer !== null) {
        setDisplay(answer);
        setExpression(answer === 'Error' ? '' : answer);
      }
      return;
    }
    if (type === 'decimal') {
      const segment = expression.split(/[+\-*/]/).at(-1) || '';
      if (segment.includes('.')) return;
      const next = expression && /[0-9)]$/.test(expression) ? `${expression}.` : `${expression}0.`;
      setExpression(next);
      setDisplay(next);
      return;
    }
    if (type === 'operator') {
      const nextOperator = operator(label);
      const next = expression
        ? /[+\-*/]$/.test(expression) ? `${expression.slice(0, -1)}${nextOperator}` : `${expression}${nextOperator}`
        : nextOperator === '-' ? '-' : '';
      setExpression(next);
      if (next) setDisplay(next.replaceAll('*', '×').replaceAll('/', '÷'));
      return;
    }
    const next = display === 'financial calculators' || display === 'Error' ? label : `${expression}${label}`;
    setExpression(next);
    setDisplay(next);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      const key = event.key;
      if (/^[0-9]$/.test(key)) { event.preventDefault(); press(key, 'number'); }
      else if (key === '.') { event.preventDefault(); press('.', 'decimal'); }
      else if (['+', '-', '*', '/'].includes(key)) { event.preventDefault(); press(key === '*' ? '×' : key === '/' ? '÷' : key === '-' ? '−' : key, 'operator'); }
      else if (key === 'Enter' || key === '=') { event.preventDefault(); press('=', 'equals'); }
      else if (key === 'Backspace') { event.preventDefault(); const next = expression.slice(0, -1); setExpression(next); setDisplay(next || 'financial calculators'); }
      else if (key === 'Escape') { event.preventDefault(); press('MC', 'clear'); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expression, memory]);

  const tilt = (event) => {
    if (!deviceRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    deviceRef.current.style.setProperty('--calculator-tilt-y', `${x * 2.2}deg`);
    deviceRef.current.style.setProperty('--calculator-tilt-x', `${y * -1.8}deg`);
  };

  const resetTilt = () => {
    deviceRef.current?.style.setProperty('--calculator-tilt-y', '0deg');
    deviceRef.current?.style.setProperty('--calculator-tilt-x', '0deg');
  };

  return <aside className="hero-3d-calculator" aria-label="Interactive financial calculator">
    <span className="hero-calculator-ambient-shadow" aria-hidden="true" />
    <span className="hero-calculator-contact-shadow" aria-hidden="true" />
    <span className="hero-calculator-reflection" aria-hidden="true" />
    <div className="hero-calculator-device" ref={deviceRef} onPointerMove={tilt} onPointerLeave={resetTilt}>
      <div className="hero-calculator-rear" aria-hidden="true" />
      <div className="hero-calculator-side" aria-hidden="true" />
      <div className="hero-calculator-front">
        <span className="hero-calculator-highlight" aria-hidden="true" />
        <div className="hero-calculator-display" role="status" aria-live="polite">
          <span>{display}</span>
        </div>
        <div className="hero-calculator-keypad" aria-label="Calculator keypad">
          {KEYS.map(([label, type, theme]) => <button
            className={`hero-calculator-key hero-calculator-key--${theme}${pressed === label ? ' is-pressed' : ''}`}
            key={label}
            type="button"
            aria-label={label === 'MC' ? 'Memory clear and reset welcome screen' : label === 'M+' ? 'Add displayed value to memory' : label}
            onClick={() => press(label, type)}
            onPointerDown={() => setPressed(label)}
            onPointerUp={() => setPressed('')}
            onPointerCancel={() => setPressed('')}
            onPointerLeave={() => setPressed('')}
          >{label}</button>)}
        </div>
      </div>
    </div>
  </aside>;
}
