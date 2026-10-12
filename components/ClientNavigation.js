'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Also covers the existing static homepage markup without changing its HTML.
export default function ClientNavigation() {
  const router = useRouter();
  useEffect(() => {
    const prefetched = new Set();
    const getLink = target => {
      const link = target instanceof Element ? target.closest('a[href]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return null;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) return null;
      if (/\.(pdf|png|jpg|jpeg|webp|svg|mp4|zip)$/i.test(url.pathname)) return null;
      return { link, url };
    };
    const prefetch = event => {
      const item = getLink(event.target);
      if (!item || item.url.pathname === window.location.pathname) return;
      const path = item.url.pathname + item.url.search;
      if (prefetched.has(path)) return;
      prefetched.add(path);
      router.prefetch(path);
    };
    const navigate = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const item = getLink(event.target);
      if (!item) return;
      const { url } = item;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', navigate);
    document.addEventListener('pointerover', prefetch, { passive: true });
    document.addEventListener('focusin', prefetch);
    return () => {
      document.removeEventListener('click', navigate);
      document.removeEventListener('pointerover', prefetch);
      document.removeEventListener('focusin', prefetch);
    };
  }, [router]);
  return null;
}
