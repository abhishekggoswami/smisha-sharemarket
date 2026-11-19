'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(GSAPSplitText, useGSAP);

/**
 * React Bits-inspired GSAP text reveal, adapted for the site's plain CSS setup.
 * The masks let every character rise from its own baseline instead of moving the
 * surrounding hero layout.
 */
export default function SplitText({
  text,
  className = '',
  delay = 24,
  duration = 0.68,
  effect = 'rise',
  splitType = 'chars',
  staggerFrom = 'start',
  mask = true,
  trigger = 'load',
  threshold = 0.1,
  rootMargin = '0px',
  onLetterAnimationComplete,
  tag: Tag = 'span',
}) {
  const ref = useRef(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element || !text || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const split = new GSAPSplitText(element, {
      type: splitType,
      mask: mask ? 'chars' : undefined,
      wordsClass: 'split-text-word',
      charsClass: 'split-text-character',
      reduceWhiteSpace: false,
    });
    const pieces = split.chars;
    const reveal = effect === 'blur'
      ? { opacity: 0, filter: 'blur(10px)' }
      : { opacity: 0, yPercent: 115 };
    const settle = effect === 'blur'
      ? { opacity: 1, filter: 'blur(0px)' }
      : { opacity: 1, yPercent: 0 };

    let observer;
    let animation;
    let hasEnteredView = false;
    const play = () => {
      animation?.kill();
      animation = gsap.fromTo(pieces, reveal, {
        ...settle,
        duration,
        ease: effect === 'blur' ? 'power2.out' : 'power3.out',
        stagger: { each: delay / 1000, from: staggerFrom },
        clearProps: 'transform,opacity,filter',
        onComplete: onLetterAnimationComplete,
      });
    };

    if (trigger === 'view' && 'IntersectionObserver' in window) {
      gsap.set(pieces, reveal);
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasEnteredView = true;
            play();
          } else if (hasEnteredView) {
            animation?.kill();
            gsap.set(pieces, reveal);
          }
        });
      }, { threshold, rootMargin });
      observer.observe(element);
    } else {
      play();
    }

    return () => {
      observer?.disconnect();
      animation?.kill();
      split.revert();
    };
  }, {
    dependencies: [text, delay, duration, effect, splitType, staggerFrom, mask, trigger, threshold, rootMargin, onLetterAnimationComplete],
    scope: ref,
    revertOnUpdate: true,
  });

  return <Tag ref={ref} className={`split-text ${className}`}>{text}</Tag>;
}
