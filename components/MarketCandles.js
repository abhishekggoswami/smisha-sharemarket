'use client';

import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const randomBetween = (min, max) => min + Math.random() * (max - min);

const nextCandle = (previousClose) => {
  const open = clamp(previousClose + randomBetween(-0.045, 0.045), 0.14, 0.86);
  const close = clamp(open + randomBetween(-0.13, 0.13), 0.12, 0.88);
  return {
    open,
    close,
    high: clamp(Math.max(open, close) + randomBetween(0.025, 0.105), 0.08, 0.94),
    low: clamp(Math.min(open, close) - randomBetween(0.025, 0.105), 0.06, 0.92),
  };
};

const createSeries = (count) => {
  const candles = [];
  let close = 0.58;
  for (let index = 0; index < count; index += 1) {
    const candle = nextCandle(close);
    candles.push(candle);
    close = candle.close;
  }
  return candles;
};

/** A non-interactive, lightweight market chart used only in the homepage hero. */
export default function MarketCandles({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const candles = createSeries(48);
    let frame = 0;
    let previousTime = 0;
    let advanceAccumulator = 0;
    let scroll = 0;
    let width = 1;
    let height = 1;
    let ratio = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const chartTop = height * 0.1;
      const chartHeight = height * 0.76;
      const spacing = clamp(width / 21, 30, 52);
      const startX = -spacing * 2 - scroll;

      context.save();
      context.globalAlpha = 0.24;
      context.strokeStyle = '#5bc9ff';
      context.lineWidth = 1;
      for (let y = chartTop; y < chartTop + chartHeight; y += chartHeight / 6) {
        context.beginPath();
        context.moveTo(0, Math.round(y) + 0.5);
        context.lineTo(width, Math.round(y) + 0.5);
        context.stroke();
      }
      const gridOffset = ((startX % spacing) + spacing) % spacing;
      for (let x = gridOffset; x < width; x += spacing) {
        context.beginPath();
        context.moveTo(Math.round(x) + 0.5, chartTop);
        context.lineTo(Math.round(x) + 0.5, chartTop + chartHeight);
        context.stroke();
      }
      context.restore();

      candles.forEach((candle, index) => {
        const x = startX + index * spacing;
        if (x < -spacing || x > width + spacing) return;
        const rising = candle.close <= candle.open;
        const color = rising ? '#30dea1' : '#ff6573';
        const y = (value) => chartTop + value * chartHeight;
        const bodyTop = y(Math.min(candle.open, candle.close));
        const bodyBottom = y(Math.max(candle.open, candle.close));
        const bodyHeight = Math.max(5, bodyBottom - bodyTop);
        const bodyWidth = clamp(spacing * 0.34, 9, 15);

        context.save();
        context.globalAlpha = 0.5;
        context.strokeStyle = color;
        context.fillStyle = color;
        context.shadowBlur = 13;
        context.shadowColor = color;
        context.lineWidth = 1.25;
        context.beginPath();
        context.moveTo(x, y(candle.high));
        context.lineTo(x, y(candle.low));
        context.stroke();
        context.globalAlpha = 0.68;
        context.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
        context.restore();
      });
    };

    const tick = (time) => {
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.08) : 0;
      previousTime = time;
      if (!prefersReducedMotion.matches) {
        scroll += elapsed * 5.5;
        advanceAccumulator += elapsed;
        if (advanceAccumulator > 1.45) {
          advanceAccumulator = 0;
          candles.shift();
          candles.push(nextCandle(candles[candles.length - 1].close));
          scroll = 0;
        }
      }
      draw();
      if (!prefersReducedMotion.matches) frame = window.requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    if (prefersReducedMotion.matches) draw();
    else frame = window.requestAnimationFrame(tick);

    const onMotionPreferenceChange = () => {
      window.cancelAnimationFrame(frame);
      previousTime = 0;
      if (prefersReducedMotion.matches) draw();
      else frame = window.requestAnimationFrame(tick);
    };
    prefersReducedMotion.addEventListener('change', onMotionPreferenceChange);

    return () => {
      observer.disconnect();
      prefersReducedMotion.removeEventListener('change', onMotionPreferenceChange);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
