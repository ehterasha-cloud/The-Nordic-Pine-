'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import type { PropertyConfig } from '@/lib/booking-engine';
import {
  AnimatedHeadline,
  ScrollReveal,
  SpotlightCard,
} from './MotionPrimitives';

export type GalleryCategory = 'All' | 'Architecture' | 'Wellness' | 'Interiors';

interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  dimensions: string;
  caption: string;
  image: string;
  spanClass: string;
}

interface BentoGalleryProps {
  config: PropertyConfig;
}

const MARQUEE_PHRASES = [
  'Book Direct',
  'Save 15.5% Airbnb Fees',
  'Complimentary 2PM Late Checkout',
  'Private Cedar Sauna',
  '104°F Cliffside Hot Tub',
  '320 Mbps Starlink',
];

export function BentoGallery({ config }: BentoGalleryProps) {
  const items: GalleryItem[] = [
    {
      id: 'ridge-facade',
      title: 'South Ridge A-Frame Facade',
      category: 'Architecture',
      dimensions: '2,450 sq ft · 28 ft Gable',
      caption: 'Charred black larch siding and triple-glazed apex overlooking Great Smoky Mountains National Park.',
      image: config.images.heroGolden,
      spanClass: 'md:col-span-2 md:row-span-2 min-h-[280px] sm:min-h-[420px]',
    },
    {
      id: 'starlit-hearth',
      title: 'Starlit Timber Terrace',
      category: 'Architecture',
      dimensions: 'Elevation 3,400 ft',
      caption: 'Twilight views across the lower terrace with sunken steel hearth and steaming cedar soaking tub.',
      image: config.images.heroNight,
      spanClass: 'md:col-span-1 md:row-span-1 min-h-[220px]',
    },
    {
      id: 'barrel-sauna',
      title: 'Cliffside Cedar Sauna & Spa',
      category: 'Wellness',
      dimensions: '205°F Cedar · 104°F Soak',
      caption: 'Panoramic glass barrel sauna cantilevered directly above the morning mist canopy.',
      image: config.images.cedarSauna,
      spanClass: 'md:col-span-1 md:row-span-1 min-h-[220px]',
    },
    {
      id: 'apex-loft',
      title: 'Panoramic Stargazing Loft',
      category: 'Interiors',
      dimensions: '480 sq ft Mezzanine',
      caption: 'Exposed Douglas fir joinery, Belgian flax linen, and warm brass sconces framing the ridge.',
      image: config.images.stargazingLoft,
      spanClass: 'md:col-span-1 md:row-span-1 min-h-[220px]',
    },
    {
      id: 'espresso-wine',
      title: "Chef's Espresso & Wine Bar",
      category: 'Interiors',
      dimensions: 'Smoked Oak & Soapstone',
      caption: 'Artisanal dual-boiler espresso station paired with backlit cellar storage and induction range.',
      image: config.images.espressoBar,
      spanClass: 'md:col-span-1 md:row-span-1 min-h-[220px]',
    },
    {
      id: 'firepit-promontory',
      title: 'Wrap-Around Firepit Deck',
      category: 'Wellness',
      dimensions: '940 sq ft Cedar Deck',
      caption: 'Private blue-hour gathering terrace with seasoned Tennessee hickory and hand-loomed wool throws.',
      image: config.images.firepitDeck,
      spanClass: 'md:col-span-1 md:row-span-1 min-h-[220px]',
    },
  ];

  const categories: GalleryCategory[] = ['All', 'Architecture', 'Wellness', 'Interiors'];
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, visibleItems.length]);

  const activeLightboxItem =
    lightboxIndex !== null ? visibleItems[lightboxIndex] ?? visibleItems[0] : null;

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-16 bg-[#08100C] border-t border-white/10"
    >
      {/* Dual-Velocity Kinetic Typography Marquee */}
      <div className="border-b border-white/10 py-4 md:py-5 overflow-hidden select-none bg-[#0D1913]">
        <div className="flex whitespace-nowrap marquee-track-fast">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-8 pr-8">
              {MARQUEE_PHRASES.map((phrase, idx) => (
                <React.Fragment key={`${dup}-${idx}`}>
                  <span className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                    {phrase}
                  </span>
                  <span aria-hidden="true" className="text-[#4B6356]">
                    ✦
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
        <div className="flex whitespace-nowrap marquee-track-slow mt-2 opacity-60">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-8 pr-8">
              {[...MARQUEE_PHRASES].reverse().map((phrase, idx) => (
                <React.Fragment key={`${dup}-rev-${idx}`}>
                  <span className="font-editorial italic text-base sm:text-lg tracking-wide text-[#E6ECE8]">
                    {phrase}
                  </span>
                  <span aria-hidden="true" className="text-[#D4AF7A]/60">
                    ·
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Asymmetric 6-Panel Bento Gallery */}
      <div className="max-w-7xl mx-auto py-12 px-5 md:py-24 md:px-12 space-y-7 md:space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2.5 max-w-xl">
            <ScrollReveal variant="clip-up">
              <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                02. Spatial Portfolio
              </p>
            </ScrollReveal>
            <AnimatedHeadline
              id="gallery-heading"
              as="h2"
              text="Crafted in charred cedar, honed soapstone, and mountain glass."
              italicWords={['charred', 'cedar']}
              className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#F4F1EA] leading-[1.08]"
            />
          </div>

          {/* Single-Row Horizontally Scrollable Filter Tabs */}
          <div
            role="tablist"
            aria-label="Gallery category filter"
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar py-1.5 px-2 rounded-xl bg-[#122019] border border-white/10 max-w-full"
          >
            {categories.map((cat) => {
              const selected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setActiveCategory(cat);
                    setLightboxIndex(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${
                    selected
                      ? 'bg-[#D4AF7A] text-[#0B1510]'
                      : 'text-[#C6D1CA] hover:text-[#F4F1EA] hover:bg-white/5'
                  }`}
                >
                  {cat === 'All' ? 'All Spaces' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Bento Grid with Spotlight Border Trace & Clip-Path Morph */}
        <div
          key={activeCategory}
          data-testid="bento-gallery-grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 auto-rows-fr clip-wipe-in"
        >
          {visibleItems.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              variant="clip-up"
              delay={idx * 90}
              className={activeCategory === 'All' ? item.spanClass : 'min-h-[260px]'}
            >
              <SpotlightCard className="h-full bg-[#122019]">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Open ${item.title} in fullscreen cinema lightbox`}
                  data-testid={`gallery-card-${item.id}`}
                  className="group relative w-full h-full min-h-[inherit] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] block"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#08100C]/92 via-[#08100C]/25 to-[#08100C]/55 transition-opacity duration-300"
                  />

                  <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#F4F1EA] drop-shadow-sm">
                        {item.dimensions}
                      </span>
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0B1510]/70 border border-white/15 text-[#F4F1EA] opacity-85 group-hover:opacity-100 group-hover:bg-[#D4AF7A] group-hover:text-[#0B1510] transition-all duration-200">
                        <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                        {item.category}
                      </p>
                      <h3 className="font-editorial text-2xl sm:text-3xl text-[#F4F1EA] leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#C7D2CB] line-clamp-2 max-w-md">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </button>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Fullscreen Cinema Lightbox with Clip-Path Reveal */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeLightboxItem.title} cinema viewer`}
          data-testid="cinema-lightbox"
          className="fixed inset-0 z-50 bg-[#050A07]/95 flex flex-col justify-between p-4 sm:p-8 clip-wipe-in"
        >
          <div className="flex items-center justify-between gap-4 max-w-6xl w-full mx-auto">
            <div className="space-y-0.5">
              <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                {activeLightboxItem.category} · {activeLightboxItem.dimensions}
              </p>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#F4F1EA]">
                {activeLightboxItem.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close cinema lightbox"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#F4F1EA] text-xs font-medium whitespace-nowrap shrink-0 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span>Close</span>
            </button>
          </div>

          <div
            key={activeLightboxItem.id}
            className="relative max-w-6xl w-full mx-auto my-4 flex-1 min-h-[320px] clip-wipe-in"
          >
            <Image
              src={activeLightboxItem.image}
              alt={activeLightboxItem.title}
              fill
              sizes="90vw"
              referrerPolicy="no-referrer"
              className="rounded-2xl object-contain"
            />
          </div>

          <div className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4">
            <p className="text-sm text-[#C6D1CA] max-w-2xl text-center sm:text-left">
              {activeLightboxItem.caption}
            </p>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-sans tabular-nums text-xs font-medium text-[#A8B5AD]">
                {lightboxIndex + 1} / {visibleItems.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + visibleItems.length) % visibleItems.length
                  )
                }
                aria-label="Previous image"
                className="p-2.5 rounded-lg bg-white/10 hover:bg-[#D4AF7A] hover:text-[#0B1510] text-[#F4F1EA] active:scale-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % visibleItems.length)
                }
                aria-label="Next image"
                className="p-2.5 rounded-lg bg-white/10 hover:bg-[#D4AF7A] hover:text-[#0B1510] text-[#F4F1EA] active:scale-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
