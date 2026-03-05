'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * PageTransition
 * Wraps page content and re-applies the enter animation on every route change.
 * No external libraries needed — pure CSS keyframes + React hook.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Remove the class first (force reflow), then add it back
    el.classList.remove('page-enter-active');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el.offsetHeight; // trigger reflow so browser recognises class removal
    el.classList.add('page-enter-active');

    // Clean up the animation class after it finishes so it doesn't block future additions
    const handleEnd = () => el.classList.remove('page-enter-active');
    el.addEventListener('animationend', handleEnd, { once: true });

    return () => el.removeEventListener('animationend', handleEnd);
  }, [pathname]);

  return (
    <div ref={wrapperRef} className="page-transition-wrapper page-enter-active">
      {children}
    </div>
  );
}
