'use client';

import React, { useEffect, useState } from 'react';

interface SplitShutterPreloaderProps {
  cabinName: string;
  onShutterOpening: () => void;
  onComplete: () => void;
}

export function SplitShutterPreloader({
  cabinName,
  onShutterOpening,
  onComplete,
}: SplitShutterPreloaderProps) {
  const [revealed, setRevealed] = useState(false);
  const [curtainLifted, setCurtainLifted] = useState(false);

  useEffect(() => {
    // 1. Softly fade in A-frame line icon, wordmark, and champagne-gold hairline
    const fadeTimer = setTimeout(() => {
      setRevealed(true);
    }, 60);

    // 2. Lift curtain smoothly at ~0.95s so total reveal completes cleanly at ~1.5s
    const liftTimer = setTimeout(() => {
      setCurtainLifted(true);
      onShutterOpening();
    }, 950);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1550);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(liftTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, onShutterOpening]);

  return (
    <div
      role="status"
      aria-label={`Entering ${cabinName}`}
      data-testid="aman-luxury-intro"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0E1A14] select-none gpu-accelerated transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        curtainLifted
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
    >
      <div
        className={`flex flex-col items-center text-center px-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {/* Minimalist Champagne-Gold Architectural A-Frame Line Crest */}
        <svg
          viewBox="0 0 96 80"
          className="w-16 h-14 sm:w-20 sm:h-16 mb-6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M48 8 L86 72 L10 72 Z"
            stroke="#D4AF7A"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27 48 L69 48 M48 8 L48 72"
            stroke="#D4AF7A"
            strokeOpacity="0.6"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>

        {/* Italic Serif Wordmark */}
        <p className="font-editorial italic text-3xl sm:text-4xl tracking-widest text-[#F4F1EA] font-normal">
          The Nordic Pine
        </p>

        {/* Single Ultra-Thin 1px Champagne-Gold Expanding Hairline */}
        <div
          aria-hidden="true"
          className={`mt-5 w-24 h-[1px] bg-[#D4AF7A] origin-center gpu-accelerated transition-transform duration-700 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            revealed ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
      </div>
    </div>
  );
}
