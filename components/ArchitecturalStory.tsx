'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Compass, Flame, ShieldCheck } from 'lucide-react';
import type { PropertyConfig } from '@/lib/booking-engine';
import {
  AnimatedBlueprintSVG,
  AnimatedHeadline,
  AnimatedNumber,
  MagneticButton,
  ScrollReveal,
} from './MotionPrimitives';

interface ArchitecturalStoryProps {
  config: PropertyConfig;
  onReserveClick: () => void;
}

interface StoryChapter {
  id: string;
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  metricValue: number;
  metricPrefix?: string;
  metricSuffix: string;
  metricLabel: string;
  secondaryTag: string;
  image: string;
  accentColor: string;
  glowClass: string;
}

export function ArchitecturalStory({
  config,
  onReserveClick,
}: ArchitecturalStoryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const manualLockUntilRef = useRef<number>(0);
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters: StoryChapter[] = [
    {
      id: 'ridge-elevation',
      index: '01',
      title: '3,400-Ft Ridge Elevation',
      eyebrow: 'Chapter One · Structural Geometry',
      description:
        'Anchored directly into Smoky Mountain granite along a private ridge crest, the charred-larch A-frame rises 28 feet with triple-pane low-iron glass walls engineered to frame rolling morning valley mist.',
      metricValue: 3400,
      metricSuffix: ' ft',
      metricLabel: 'Private Ridge Altitude',
      secondaryTag: '28 ft Gable · 2,450 sq ft Living',
      image: config.images.heroGolden,
      accentColor: '#D4AF7A',
      glowClass: 'bg-[#D4AF7A]/20',
    },
    {
      id: 'thermal-hydrotherapy',
      index: '02',
      title: 'Nordic Thermal Hydrotherapy',
      eyebrow: 'Chapter Two · Cliffside Wellness',
      description:
        'Step from a 205°F Western red cedar Finnish barrel sauna straight into the steaming 104°F cliffside cedar soaking tub and cold mountain rain shower cantilevered above old-growth hemlocks.',
      metricValue: 205,
      metricSuffix: '°F',
      metricLabel: 'Finnish Cedar Sauna Peak',
      secondaryTag: '104°F Cliffside Tub · Cold Shower',
      image: config.images.cedarSauna,
      accentColor: '#34D399',
      glowClass: 'bg-emerald-500/20',
    },
    {
      id: 'direct-sanctuary',
      index: '03',
      title: 'Zero-Commission Direct Sanctuary',
      eyebrow: 'Chapter Three · Host Arbitrage',
      description:
        'Skip third-party marketplace markups entirely. Messaging hosts Henrik & Maja directly via WhatsApp eliminates the 15.5% platform service fee and unlocks complimentary 2PM late checkout.',
      metricValue: config.airbnbFeePercent,
      metricSuffix: '%',
      metricLabel: 'Platform Fees Eliminated',
      secondaryTag: '$0 Service Fee · 2PM Late Checkout',
      image: config.images.espressoBar,
      accentColor: '#E5B869',
      glowClass: 'bg-amber-400/20',
    },
  ];

  // Track chapter scroll progress via passive rAF on scroll
  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const evaluateActiveChapter = () => {
      ticking = false;
      if (performance.now() < manualLockUntilRef.current) return;
      const anchorY = window.innerHeight * 0.42;
      let bestIndex = 0;
      let smallestDistance = Infinity;

      chapterRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - anchorY);
        if (dist < smallestDistance) {
          smallestDistance = dist;
          bestIndex = idx;
        }
      });

      setActiveChapter((prev) => (prev === bestIndex ? prev : bestIndex));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(evaluateActiveChapter);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const current = chapters[activeChapter] ?? chapters[0];

  const renderChapterIcon = (idx: number) => {
    if (idx === 0) return <Compass className="w-4 h-4 text-[#D4AF7A]" aria-hidden="true" />;
    if (idx === 1) return <Flame className="w-4 h-4 text-emerald-400" aria-hidden="true" />;
    return <ShieldCheck className="w-4 h-4 text-[#E5B869]" aria-hidden="true" />;
  };

  return (
    <section
      ref={sectionRef}
      id="story"
      aria-labelledby="story-heading"
      className="scroll-mt-16 relative py-14 px-5 md:py-24 md:px-12 bg-[#09120D] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Section Intro */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
              Architectural Narrative
            </p>
            <AnimatedHeadline
              id="story-heading"
              as="h2"
              text="Three chapters of alpine engineering and direct hospitality."
              italicWords={['alpine', 'engineering']}
              className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#F4F1EA] leading-[1.08]"
            />
          </div>

          {/* Interactive Chapter Jump Pills (Touch-Friendly on Mobile + Desktop) */}
          <div
            role="tablist"
            aria-label="Story chapters"
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar py-1"
          >
            {chapters.map((ch, idx) => {
              const isSelected = idx === activeChapter;
              return (
                <button
                  key={ch.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    manualLockUntilRef.current = performance.now() + 850;
                    setActiveChapter(idx);
                    chapterRefs.current[idx]?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }}
                  data-testid={`story-tab-${ch.index}`}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${
                    isSelected
                      ? 'bg-[#D4AF7A] text-[#0B1510]'
                      : 'bg-[#122019] text-[#C8D3CC] border border-white/15 hover:border-[#D4AF7A]/50'
                  }`}
                >
                  {ch.index}. {ch.title.split(' ')[0]} {ch.title.split(' ')[1]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Scrollytelling Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* LEFT: Pinned Cross-Fading Photography + Self-Drawing Blueprint Overlay */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
            <div
              data-testid="story-pinned-stage"
              className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#101C16] min-h-[300px] sm:min-h-[420px] lg:min-h-[500px]"
            >
              {/* Dynamic Ambient Accent Lighting */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl transition-colors duration-700 z-10 ${current.glowClass}`}
              />

              {/* Cross-Fading Photography Layers */}
              {chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    idx === activeChapter
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-[1.03] pointer-events-none'
                  }`}
                >
                  <Image
                    src={ch.image}
                    alt={ch.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                    className="object-cover brightness-[0.82]"
                  />
                </div>
              ))}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#09120D]/95 via-[#09120D]/30 to-[#09120D]/40 z-10"
              />

              {/* Self-Drawing Vector Blueprint Overlay */}
              <div className="absolute top-4 right-4 w-36 sm:w-44 z-20 rounded-xl bg-[#0B1510]/70 border border-white/15 p-2.5 backdrop-blur-sm">
                <AnimatedBlueprintSVG activeChapter={activeChapter} />
              </div>

              {/* Live Animated Chapter Metric Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 font-sans tracking-[0.14em] uppercase text-[11px] font-medium text-[#D4AF7A]">
                    {renderChapterIcon(activeChapter)}
                    <span>Chapter {current.index}</span>
                  </div>
                  <p className="font-editorial text-2xl sm:text-3xl text-[#F4F1EA]">
                    {current.title}
                  </p>
                  <p className="font-sans text-xs text-[#B6C2BA]">{current.secondaryTag}</p>
                </div>

                <div className="rounded-xl bg-[#0B1510]/85 border border-white/15 px-4 py-2.5 text-right">
                  <p
                    data-testid="story-live-metric"
                    className="font-editorial text-3xl sm:text-4xl leading-none"
                    style={{ color: current.accentColor }}
                  >
                    <AnimatedNumber
                      value={current.metricValue}
                      prefix={current.metricPrefix ?? ''}
                      suffix={current.metricSuffix}
                      decimals={current.metricValue % 1 !== 0 ? 1 : 0}
                    />
                  </p>
                  <p className="font-sans tracking-[0.12em] uppercase text-[10px] font-medium text-[#A8B5AD] mt-1">
                    {current.metricLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Scrolling Story Chapters */}
          <div className="lg:col-span-6 space-y-5 lg:space-y-10">
            {chapters.map((ch, idx) => {
              const isActive = idx === activeChapter;
              return (
                <ScrollReveal key={ch.id} variant="clip-up" delay={idx * 90}>
                  <div
                    ref={(el) => {
                      chapterRefs.current[idx] = el;
                    }}
                    onClick={() => setActiveChapter(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveChapter(idx);
                      }
                    }}
                    data-testid={`story-chapter-${ch.index}`}
                    className={`rounded-2xl border p-5 sm:p-7 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${
                      isActive
                        ? 'bg-[#122019] border-[#D4AF7A]/55 shadow-lg'
                        : 'bg-[#0E1813]/75 border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span
                        className="font-sans tracking-[0.14em] uppercase text-xs font-medium"
                        style={{ color: ch.accentColor }}
                      >
                        {ch.eyebrow}
                      </span>
                      <span className="font-sans tabular-nums text-xs font-semibold text-[#A8B5AD]">
                        {ch.index} / 03
                      </span>
                    </div>

                    <h3 className="font-editorial text-2xl sm:text-3xl text-[#F4F1EA] leading-tight">
                      {ch.title}
                    </h3>

                    <p className="text-sm sm:text-[15px] text-[#C8D3CC] leading-relaxed mt-3">
                      {ch.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A8B5AD]">
                      <span>{ch.secondaryTag}</span>
                      <span style={{ color: ch.accentColor }} className="font-medium">
                        {isActive ? 'Active View' : 'Inspect Chapter'}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}

            <div className="pt-1">
              <MagneticButton onClick={onReserveClick} className="px-6 py-3.5">
                <span>Lock In Direct Host Rates</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
