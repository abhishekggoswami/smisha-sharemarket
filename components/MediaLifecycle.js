'use client';

import { useEffect } from 'react';

// Background videos keep their existing appearance while visible, but do not
// download/play lower-page clips before they are near the viewport.
export default function MediaLifecycle() {
  useEffect(() => {
    const videos = new Map();
    const play = (video, visible) => {
      if (visible && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const load = video => {
      if (video.dataset.src) { video.src = video.dataset.src; delete video.dataset.src; }
      video.querySelectorAll('source[data-src]').forEach(source => { source.src = source.dataset.src; delete source.dataset.src; });
      if (video.dataset.deferredVideo === 'true') { delete video.dataset.deferredVideo; video.load(); }
    };
    const preload = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        load(target);
        preload.unobserve(target);
      });
    }, { rootMargin: '600px' });
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        videos.set(target, isIntersecting);
        if (isIntersecting) load(target);
        play(target, isIntersecting);
      });
    });
    const scan = () => {
      document.querySelectorAll('video[autoplay]').forEach(video => {
        if (videos.has(video)) return;
        videos.set(video, false);
        preload.observe(video);
        visibility.observe(video);
      });
      videos.forEach((_, video) => {
        if (video.isConnected) return;
        preload.unobserve(video); visibility.unobserve(video); videos.delete(video);
      });
    };
    const onVisibility = () => videos.forEach((visible, video) => play(video, visible));
    const mutation = new MutationObserver(scan);
    mutation.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('visibilitychange', onVisibility);
    scan();
    return () => {
      mutation.disconnect(); preload.disconnect(); visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      videos.clear();
    };
  }, []);
  return null;
}
