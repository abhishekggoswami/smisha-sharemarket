'use client';

import { useEffect, useRef } from 'react';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

/*
 * A dependency-free adaptation of React Bits' TextPressure interaction.
 * Urbanist exposes a variable weight axis but not a width axis, so width is
 * represented with a very small character-scale range. That preserves the
 * established typeface rather than silently substituting another font.
 */
export default function TextPressure({
  text,
  className = '',
  minWeight = 560,
  maxWeight = 850,
  intensity = 1,
}) {
  const rootRef = useRef(null);
  const characterRefs = useRef([]);
  const frameRef = useRef(0);
  const targetRef = useRef(null);
  const currentRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const reset = () => {
      characterRefs.current.forEach((character) => {
        if (!character) return;
        character.style.fontVariationSettings = `'wght' ${minWeight}`;
        character.style.transform = 'scaleX(1) translateY(0)';
        character.style.opacity = '1';
      });
    };

    const render = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      if (!target || !current) return;

      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      const titleBounds = root.getBoundingClientRect();
      const radius = Math.max(150, Math.min(360, titleBounds.width * 0.58));

      characterRefs.current.forEach((character) => {
        if (!character || character.dataset.space === 'true') return;
        const bounds = character.getBoundingClientRect();
        const x = bounds.left + (bounds.width / 2);
        const y = bounds.top + (bounds.height / 2);
        const distance = Math.hypot(current.x - x, current.y - y);
        const proximity = clamp(1 - (distance / radius), 0, 1) * intensity;
        const eased = proximity * proximity * (3 - (2 * proximity));
        const weight = Math.round(minWeight + ((maxWeight - minWeight) * eased));
        const scaleX = 0.985 + (eased * 0.07);
        const lift = eased * -1.5;

        character.style.fontVariationSettings = `'wght' ${weight}`;
        character.style.transform = `scaleX(${scaleX}) translateY(${lift}px)`;
        character.style.opacity = String(0.9 + (eased * 0.1));
      });

      if (Math.hypot(target.x - current.x, target.y - current.y) > 0.2) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      if (!currentRef.current) currentRef.current = { x: event.clientX, y: event.clientY };
      requestRender();
    };

    const handlePointerLeave = () => {
      targetRef.current = null;
      currentRef.current = null;
      window.cancelAnimationFrame(frameRef.current);
      reset();
    };

    reset();
    root.addEventListener('pointermove', handlePointerMove);
    root.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      window.cancelAnimationFrame(frameRef.current);
      root.removeEventListener('pointermove', handlePointerMove);
      root.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [intensity, maxWeight, minWeight, text]);

  return <span ref={rootRef} className={`text-pressure ${className}`} aria-label={text}>
    {Array.from(text).map((character, index) => <span
      aria-hidden="true"
      className="text-pressure-character"
      data-space={character === ' ' ? 'true' : undefined}
      key={`${character}-${index}`}
      ref={(element) => { characterRefs.current[index] = element; }}
    >{character === ' ' ? '\u00a0' : character}</span>)}
  </span>;
}
