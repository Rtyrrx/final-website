'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function FluidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorInner = cursorInnerRef.current;

    if (!cursor || !cursorInner) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      // Smooth following with GSAP
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.to(cursorInner, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power4.out'
      });
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Glass morphism cursor */}
      <div
        ref={cursorRef}
        className="fixed w-12 h-12 rounded-full pointer-events-none z-[10000]"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(255,255,255,0.08)',
        }}
      />
      {/* Center dot */}
      <div
        ref={cursorInnerRef}
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[10001] bg-white"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
}
