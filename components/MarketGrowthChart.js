'use client';

import { useEffect, useRef } from 'react';

// Simulated prices provide an animated illustration; they are not market data.
const initialCloses = [560, 542, 550, 520, 502, 516, 487, 468, 480, 492, 464, 445, 459, 428, 408, 421, 437, 419, 390, 372, 387, 401, 381, 352, 337, 354, 367, 343, 323, 305, 322, 340, 313, 290, 278, 294, 307, 285, 260, 242, 254, 269, 246, 220, 205, 222, 235, 212, 190, 172, 185, 166, 145, 130];
const WIDTH = 1600;
const HEIGHT = 700;
const PERIOD = 3000;

export default function MarketGrowthChart({ upColor = '#2B7A7A', downColor = '#D4AF37' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const candles = initialCloses.map((close, index) => {
      const open = index ? initialCloses[index - 1] : 575;
      return { open, close, high: Math.min(open, close) - (7 + index * 7 % 16), low: Math.max(open, close) + (7 + index * 11 % 15) };
    });
    let frame = 0;
    let visible = false;
    let lastFrame = 0;
    let lastDraw = 0;
    let elapsed = 0;
    let tickElapsed = 0;
    let shift = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas.height = Math.max(1, Math.round(bounds.height * ratio));
      draw();
    };
    const draw = () => {
      context.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
      context.clearRect(0, 0, WIDTH, HEIGHT);
      const step = WIDTH / (candles.length - 1);
      candles.forEach((candle, index) => {
        const x = index * step + (1 - shift) * step;
        context.strokeStyle = context.fillStyle = candle.close <= candle.open ? upColor : downColor;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x, candle.high);
        context.lineTo(x, candle.low);
        context.stroke();
        context.fillRect(x - 5, Math.min(candle.open, candle.close), 10, Math.max(2, Math.abs(candle.open - candle.close)));
      });
    };
    const animate = (now) => {
      if (!visible || document.hidden || motion.matches) { frame = 0; lastFrame = 0; return; }
      const delta = lastFrame ? Math.min(now - lastFrame, 100) : 0;
      lastFrame = now;
      elapsed += delta;
      tickElapsed += delta;
      shift = Math.min(1, shift + delta / 450);
      if (tickElapsed >= 180) {
        tickElapsed = 0;
        const current = candles[candles.length - 1];
        // Price ticks update the current candle; the extremes persist until it closes.
        current.close = Math.max(65, Math.min(570, current.close + (Math.random() - .5) * 7 + (220 - current.close) * .012));
        current.high = Math.min(current.high, current.close);
        current.low = Math.max(current.low, current.close);
      }
      if (elapsed >= PERIOD) {
        elapsed %= PERIOD;
        const previous = candles[candles.length - 1].close;
        candles.shift();
        candles.push({ open: previous, close: previous, high: previous, low: previous });
        shift = 0;
      }
      if (now - lastDraw >= 1000 / 30) {
        draw();
        lastDraw = now;
      }
      frame = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (!frame && visible && !document.hidden && !motion.matches) frame = window.requestAnimationFrame(animate);
    };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    }) : null;
    if (observer) observer.observe(canvas);
    else { visible = true; start(); }
    const onVisibility = () => { if (!document.hidden) start(); };
    const onMotion = () => { if (!motion.matches) start(); else draw(); };
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener?.('change', onMotion);
    resize();
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener?.('change', onMotion);
    };
  }, [upColor, downColor]);

  return <canvas ref={canvasRef} />;
}
