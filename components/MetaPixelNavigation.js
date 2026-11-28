'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// The base pixel tracks the initial load; track subsequent client-side page changes.
export default function MetaPixelNavigation() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname;
      window.fbq?.('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
