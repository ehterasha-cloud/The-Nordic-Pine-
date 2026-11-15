'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ============================================================================
 * 1. SCROLL PHYSICS HOOK (useScrollPhysics)
 * Passive rAF scroll progress ribbon + smoothed velocity tracker (0 re-renders)
 * ========================================================================== */
export function useScrollPhysics(ribbonRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const rawProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
      const clamped = Math.min(1, Math.max(0, rawProgress));
      if (ribbonRef.current) {
        ribbonRef.current.style.transform = `scaleX(${clamped})`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ribbonRef]);
}

/* ============================================================================
 * 2. DIRECTIONAL SCROLL REVEAL WRAPPER (<ScrollReveal />)
 * Supports 'clip-up' | 'blur-scale' | 'slide-horizontal' + staggered cascade
 * ========================================================================== */
interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'clip-up' | 'blur-scale' | 'slide-horizontal';
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = 'clip-up',
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(node);

    // Safety fallback so deep elements never remain hidden during programmatic jumps
    const safety = setTimeout(() => setVisible(true), 1800);

    return () => {
      clearTimeout(safety);
      observer.disconnect();
    };
  }, []);

  const hiddenClass =
    variant === 'blur-scale'
      ? 'opacity-0 scale-[0.96] blur-[4px]'
      : variant === 'slide-horizontal'
      ? 'opacity-0 translate-x-6'
      : 'opacity-0 translate-y-5';

  const shownClass =
    variant === 'blur-scale'
      ? 'opacity-100 scale-100 blur-0'
      : variant === 'slide-horizontal'
      ? 'opacity-100 translate-x-0'
      : 'opacity-100 translate-y-0';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`gpu-accelerated transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? shownClass : hiddenClass
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ============================================================================
 * 3. MULTI-SPEED PARALLAX CONTAINER (<ParallaxLayer />)
 * Hardware-accelerated translate3d(0, y, 0), toned down automatically on mobile
 * ========================================================================== */
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // e.g. 0.25 background, 1.0 midground, 1.15 foreground
  className?: string;
}

export function ParallaxLayer({
  children,
  speed = 1,
  className = '',
}: ParallaxLayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || speed === 1) return;

    let rafId = 0;
    let ticking = false;

    const applyParallax = () => {
      ticking = false;
      if (!node) return;
      const isMobile = window.innerWidth < 768;
      const factor = isMobile ? (speed - 1) * 0.2 : speed - 1;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - elementCenter) * factor * 0.16;
      const clamped = Math.max(-48, Math.min(48, offset));
      node.style.transform = `translate3d(0, ${clamped.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(applyParallax);
      }
    };

    applyParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={`gpu-accelerated ${className}`}>
      {children}
    </div>
  );
}

/* ============================================================================
 * 4. MASKED TEXT & WORD REVEAL (<AnimatedHeadline />)
 * Word-level overflow-hidden masks animating from translateY(110%) rotate(2deg)
 * ========================================================================== */
interface AnimatedHeadlineProps {
  id?: string;
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  italicWords?: string[];
  active?: boolean;
  staggerMs?: number;
}

export function AnimatedHeadline({
  id,
  text,
  as = 'h2',
  className = '',
  italicWords = [],
  active,
  staggerMs = 45,
}: AnimatedHeadlineProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [inView, setInView] = useState(Boolean(active));

  useEffect(() => {
    if (active !== undefined) {
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    const safety = setTimeout(() => setInView(true), 1600);
    return () => {
      clearTimeout(safety);
      observer.disconnect();
    };
  }, [active]);

  const isRevealed = active !== undefined ? active : inView;
  const words = text.split(' ');
  const italicSet = new Set(italicWords.map((w) => w.toLowerCase()));
  const Tag = as;

  return (
    <Tag ref={ref} id={id} className={`text-balance ${className}`}>
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[.,!?—]/g, '').toLowerCase();
        const isItalic = italicSet.has(cleanWord);
        return (
          <React.Fragment key={`${word}-${idx}`}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
              <span
                style={{ transitionDelay: `${idx * staggerMs}ms` }}
                className={`inline-block gpu-accelerated transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isItalic ? 'italic font-normal text-[#E7D4B1]' : ''
                } ${
                  isRevealed
                    ? 'translate-y-0 rotate-0 opacity-100'
                    : 'translate-y-[112%] rotate-[2deg] opacity-0'
                }`}
              >
                {word}
              </span>
            </span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </Tag>
  );
}

/* ============================================================================
 * 5. MAGNETIC PULL & LIQUID-FILL BUTTON (<MagneticButton />)
 * 12px magnetic field pull + bottom-to-top liquid champagne-gold fill sweep
 * ========================================================================== */
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'gold' | 'glass';
  className?: string;
}

export function MagneticButton({
  children,
  variant = 'gold',
  className = '',
  onMouseMove,
  onMouseLeave,
  ...rest
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (el && window.innerWidth >= 768) {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const maxPull = 12;
      const pullX = Math.max(-maxPull, Math.min(maxPull, (relX / (rect.width / 2)) * maxPull));
      const pullY = Math.max(-maxPull, Math.min(maxPull, (relY / (rect.height / 2)) * maxPull));
      el.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
    }
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (btnRef.current) {
      btnRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    onMouseLeave?.(e);
  };

  const baseStyles =
    variant === 'gold'
      ? 'bg-[#D4AF7A] text-[#0B1510] border border-[#E7CFA8]/50'
      : 'bg-[#0B1510]/75 text-[#F4F1EA] border border-white/20 hover:text-[#0B1510]';

  const sweepStyles =
    variant === 'gold' ? 'bg-[#E6C594]' : 'bg-[#D4AF7A]';

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm whitespace-nowrap shrink-0 gpu-accelerated transition-[transform,color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${baseStyles} ${className}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${sweepStyles}`}
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

/* ============================================================================
 * 6. CURSOR-TRACKING SPOTLIGHT & BORDER-DRAW CARD (<SpotlightCard />)
 * Tracks --mouse-x & --mouse-y CSS variables for radial gold spotlight & border
 * ========================================================================== */
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article';
}

export function SpotlightCard({
  children,
  className = '',
  as = 'div',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const Tag = as;

  return (
    <Tag
      ref={cardRef as React.RefObject<HTMLDivElement>}
      onPointerMove={handlePointerMove}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 transition-colors duration-300 hover:border-[#D4AF7A]/45 ${className}`}
    >
      {/* Radial Champagne-Gold Spotlight Glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(360px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 122, 0.15), transparent 65%)',
        }}
      />
      {/* Illuminated 1px Perimeter Border Trace */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          padding: '1px',
          background:
            'radial-gradient(240px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 122, 0.7), transparent 70%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}

/* ============================================================================
 * 7. SELF-DRAWING ARCHITECTURAL BLUEPRINT SVG (<AnimatedBlueprintSVG />)
 * Draws multi-path A-frame elevation & mountain topography contours on view
 * ========================================================================== */
interface AnimatedBlueprintSVGProps {
  activeChapter?: number;
  className?: string;
}

export function AnimatedBlueprintSVG({
  activeChapter = 0,
  className = '',
}: AnimatedBlueprintSVGProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDrawn(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    const safety = setTimeout(() => setDrawn(true), 1400);
    return () => {
      clearTimeout(safety);
      observer.disconnect();
    };
  }, []);

  const accentStroke =
    activeChapter === 1 ? '#34D399' : activeChapter === 2 ? '#E5B869' : '#D4AF7A';

  return (
    <svg
      ref={ref}
      viewBox="0 0 360 240"
      fill="none"
      aria-hidden="true"
      className={`w-full h-auto ${className}`}
    >
      {/* Mountain Ridge Topography Contours */}
      <path
        d="M12 195 Q75 145 135 170 T255 152 T348 188"
        stroke={accentStroke}
        strokeOpacity="0.45"
        strokeWidth="1.2"
        strokeDasharray="1000"
        strokeDashoffset={drawn ? 0 : 1000}
        className="transition-[stroke-dashoffset,stroke] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      />
      <path
        d="M18 214 Q95 178 165 196 T342 206"
        stroke="#F4F1EA"
        strokeOpacity="0.22"
        strokeWidth="1"
        strokeDasharray="1000"
        strokeDashoffset={drawn ? 0 : 1000}
        className="transition-[stroke-dashoffset] duration-[1600ms] delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />

      {/* Primary A-Frame Elevation Crest */}
      <path
        d="M180 24 L288 192 L72 192 Z"
        stroke={accentStroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1000"
        strokeDashoffset={drawn ? 0 : 1000}
        className="transition-[stroke-dashoffset,stroke] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      />

      {/* Cantilevered Cedar Deck & Loft Timber Crossbeams */}
      <path
        d="M42 192 L318 192 M118 122 L242 122 M180 24 L180 192 M136 192 L180 122 L224 192"
        stroke="#F4F1EA"
        strokeOpacity="0.65"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeDasharray="1000"
        strokeDashoffset={drawn ? 0 : 1000}
        className="transition-[stroke-dashoffset] duration-[1500ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />

      {/* Elevation Dimension Callout Lines */}
      <path
        d="M312 24 L312 192 M306 24 L318 24 M306 192 L318 192"
        stroke={accentStroke}
        strokeOpacity="0.55"
        strokeWidth="1"
        strokeDasharray="1000"
        strokeDashoffset={drawn ? 0 : 1000}
        className="transition-[stroke-dashoffset,stroke] duration-[1300ms] delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />
    </svg>
  );
}

/* ============================================================================
 * 8. REQUESTANIMATIONFRAME NUMBER TICKER (<AnimatedNumber />)
 * Smoothly counts numeric values over 450ms whenever value updates
 * ========================================================================== */
interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 450,
  className = '',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const currentRef = useRef(value);

  useEffect(() => {
    const startVal = currentRef.current;
    const endVal = value;
    if (startVal === endVal) return;

    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - ratio, 3);
      const next = startVal + (endVal - startVal) * eased;
      currentRef.current = next;
      setDisplayValue(next);

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        currentRef.current = endVal;
        setDisplayValue(endVal);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, durationMs]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString();

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
