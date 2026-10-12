// Keep the same visible animation and frame rate, but stop scheduling work
// while its element is offscreen, the tab is hidden, or reduced motion is on.
export function createVisibleAnimation(element, render, fps = 60) {
  let frame = 0;
  let visible = false;
  let last = 0;
  let disposed = false;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = 1000 / fps;
  const stop = () => { cancelAnimationFrame(frame); frame = 0; };
  const tick = now => {
    frame = 0;
    if (disposed || !visible || document.hidden || motion.matches) return;
    if (now - last >= interval) { last = now; render(now); }
    frame = requestAnimationFrame(tick);
  };
  const update = () => {
    if (visible && !document.hidden && !motion.matches && !disposed) {
      if (!frame) { last = 0; frame = requestAnimationFrame(tick); }
    } else stop();
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });
  observer.observe(element);
  document.addEventListener('visibilitychange', update);
  motion.addEventListener('change', update);
  return () => {
    disposed = true;
    stop(); observer.disconnect();
    document.removeEventListener('visibilitychange', update);
    motion.removeEventListener('change', update);
  };
}
