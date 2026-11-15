'use client';

import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Compass, Flame, MapPin, Moon, RotateCcw, ShieldCheck, Sparkles, Star, Sun, Waves, Wifi } from 'lucide-react';
import type { PropertyConfig } from '@/lib/booking-engine';
import { SplitShutterPreloader } from './SplitShutterPreloader';
import { ArchitecturalStory } from './ArchitecturalStory';
import { SpatialHotspots } from './SpatialHotspots';
import { BentoGallery } from './BentoGallery';
import { BookingConciergeEngine } from './BookingConciergeEngine';
import { AnimatedHeadline, MagneticButton, ParallaxLayer, ScrollReveal, SpotlightCard, useScrollPhysics } from './MotionPrimitives';

export const PROPERTY_CONFIG: PropertyConfig = {
  cabinName: 'The Nordic Pine A-Frame',
  tagline: 'Private Cliffside Sanctuary · Smoky Mountains',
  location: 'Gatlinburg Ridge, Smoky Mountains, TN',
  coordinates: '35.7143° N',
  elevation: 'Elevation 3,400 ft',
  whatsappNumber: '+1 (865) 555-0194',
  hostName: 'Henrik & Maja Lindqvist',
  weekdayRate: 445,
  weekendRate: 565,
  cleaningFee: 145,
  airbnbFeePercent: 15.5,
  rating: '4.98',
  reviewCount: 142,
  maxGuests: 6,
  wifiSpeed: '320 Mbps Starlink',
  hotTubTemp: '104°F Hot Tub',
  images: {
    heroGolden: '/images/hero_alpine_golden.jpg',
    heroNight: '/images/hero_starlit_night.jpg',
    stargazingLoft: '/images/spatial_stargazing_loft.jpg',
    cedarSauna: '/images/spatial_cedar_sauna.jpg',
    espressoBar: '/images/spatial_espresso_bar.jpg',
    firepitDeck: '/images/gallery_firepit_deck.jpg',
  },
};

type HeroAmbiance = 'golden' | 'night';

const GUEST_REVIEWS = [
  {
    id: 'rev-1',
    guest: 'Marcus & Hannah Vance',
    stayContext: '4-Night Direct Autumn Stay · Atlanta, GA',
    quote:
      'Booking direct saved us $318 in platform fees and got us a pre-warmed cedar sauna before we even unpacked. Waking up in the glass apex above the ridge mist feels surreal.',
  },
  {
    id: 'rev-2',
    guest: 'Dr. Priya Nair',
    stayContext: '3-Night Remote Work Retreat · Chicago, IL',
    quote:
      '320 Mbps Starlink held flawless video calls all morning, and the 104-degree hot tub under the stars made every evening feel like a private Nordic spa.',
  },
  {
    id: 'rev-3',
    guest: 'Julian & Theo Mercer',
    stayContext: '5-Night Winter Solstice Stay · Austin, TX',
    quote:
      'Henrik greeted us via WhatsApp with trail notes and stocked hickory firewood ready on the deck. Zero friction, architectural craftsmanship everywhere.',
  },
];

export function NordicPineShowcase({ initialAutostart = false }: { initialAutostart?: boolean }) {
  const [preloaderActive, setPreloaderActive] = useState(!initialAutostart);
  const [introRunKey, setIntroRunKey] = useState(0);
  const [heroRevealed, setHeroRevealed] = useState(initialAutostart);
  const [ambiance, setAmbiance] = useState<HeroAmbiance>('golden');
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  useScrollPhysics(ribbonRef);

  const handleShutterOpening = useCallback(() => {
    setHeroRevealed(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderActive(false);
  }, []);

  const handleReplayIntro = () => {
    setHeroRevealed(false);
    setIntroRunKey((k) => k + 1);
    setPreloaderActive(true);
  };

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isNight = ambiance === 'night';
  const activeHeroImage = isNight
    ? PROPERTY_CONFIG.images.heroNight
    : PROPERTY_CONFIG.images.heroGolden;

  return (
    <div className="min-h-screen bg-[#0B1510] text-[#F4F1EA]">
      {/* Embedded Signature Motion & Keyframe Choreography */}
      <style>{`
        @keyframes mistFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.28;
          }
          50% {
            transform: translate3d(18px, -24px, 0) scale(1.06);
            opacity: 0.5;
          }
        }
        .mist-particle-a {
          animation: mistFloat 9s ease-in-out infinite;
        }
        .mist-particle-b {
          animation: mistFloat 12s ease-in-out 2s infinite reverse;
        }

        @keyframes sonarRipple {
          0% {
            transform: scale(0.95);
            opacity: 0.85;
          }
          75%, 100% {
            transform: scale(2.15);
            opacity: 0;
          }
        }
        .sonar-ring {
          animation: sonarRipple 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        @keyframes marqueeLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .marquee-track-fast {
          animation: marqueeLeft 28s linear infinite;
          will-change: transform;
        }
        .marquee-track-slow {
          animation: marqueeLeft 46s linear infinite reverse;
          will-change: transform;
        }

        @keyframes clipWipeIn {
          0% {
            clip-path: inset(0 0 100% 0);
            opacity: 0.35;
          }
          100% {
            clip-path: inset(0 0 0% 0);
            opacity: 1;
          }
        }
        .clip-wipe-in {
          animation: clipWipeIn 0.52s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes counterRipple {
          0% {
            transform: scale(0.7);
            opacity: 0.85;
          }
          100% {
            transform: scale(1.9);
            opacity: 0;
          }
        }
        .counter-ripple {
          animation: counterRipple 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .mist-particle-a,
          .mist-particle-b,
          .sonar-ring,
          .marquee-track-fast,
          .marquee-track-slow,
          .clip-wipe-in,
          .counter-ripple {
            animation: none !important;
          }
        }
      `}</style>

      {/* Top 2px Champagne-Gold Reading Progress Ribbon (Passive rAF, 0 Re-renders) */}
      <div
        ref={ribbonRef}
        data-testid="scroll-progress-ribbon"
        aria-hidden="true"
        style={{ transform: 'scaleX(0)' }}
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left bg-gradient-to-r from-[#D4AF7A] via-[#F2D9AA] to-[#D4AF7A] pointer-events-none"
      />

      {/* Aman-Style 1.5s Minimal Luxury Intro Overlay */}
      {preloaderActive && (
        <SplitShutterPreloader
          key={introRunKey}
          cabinName={PROPERTY_CONFIG.cabinName}
          onShutterOpening={handleShutterOpening}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* Top Navigation & Utility Bar (Iframe-Safe Button Navigation, Zero <a href="#...">) */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/10 bg-[#0B1510]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="font-editorial italic text-lg sm:text-xl tracking-wide text-[#F4F1EA] whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] rounded"
          >
            The Nordic Pine
          </button>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-7 text-xs font-medium text-[#C8D3CC]"
          >
            <button
              type="button"
              onClick={() => scrollToSection('story')}
              className="hover:text-[#D4AF7A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] rounded py-1"
            >
              Story
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('architecture')}
              className="hover:text-[#D4AF7A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] rounded py-1"
            >
              Architecture
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('gallery')}
              className="hover:text-[#D4AF7A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] rounded py-1"
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('reviews')}
              className="hover:text-[#D4AF7A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] rounded py-1"
            >
              Reviews
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('reserve')}
              className="hover:text-[#D4AF7A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] rounded py-1"
            >
              Calendar
            </button>
          </nav>

          {/* Zone 3: Minimal Luxury Replay Intro Pill + Primary Action */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReplayIntro}
              data-testid="replay-intro-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-[#D4AF7A]/60 hover:text-[#D4AF7A] text-xs font-medium text-[#D6DFD9] whitespace-nowrap shrink-0 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
            >
              <RotateCcw className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>Replay Intro</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('reserve')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4AF7A] hover:bg-[#E1BC89] text-[#0B1510] text-xs font-semibold whitespace-nowrap shrink-0 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA]"
            >
              <span>Book Direct</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Editorial Hero with Multi-Layer Parallax & Sliding Ambiance Segmented Pill */}
        <section
          id="hero"
          data-ambiance={ambiance}
          className="relative md:min-h-screen w-full overflow-hidden flex flex-col justify-between pt-16 sm:pt-20 pb-20 md:pb-10 px-5 sm:px-8 lg:px-14"
        >
          {/* Background Photography Layer (0.25x Parallax + scale 1.06 -> 1.0 settle) */}
          <ParallaxLayer speed={0.25} className="absolute -inset-12">
            <div
              className={`relative w-full h-full gpu-accelerated transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                heroRevealed ? 'scale-100' : 'scale-[1.06]'
              }`}
            >
              <Image
                src={activeHeroImage}
                alt={
                  isNight
                    ? `${PROPERTY_CONFIG.cabinName} under starlit night sky with glowing firepit`
                    : `${PROPERTY_CONFIG.cabinName} bathed in Smoky Mountain golden hour sunlight`
                }
                fill
                priority
                sizes="100vw"
                referrerPolicy="no-referrer"
                className="object-cover transition-opacity duration-700"
              />
            </div>
          </ParallaxLayer>

          {/* Multi-Stop Vertical Contrast Scrim + Ambiance Radial Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#0B1510]/85 via-[#0B1510]/45 to-[#0B1510]/95"
          />
          <div
            aria-hidden="true"
            className={`absolute inset-0 transition-colors duration-700 ${
              isNight
                ? 'bg-[radial-gradient(circle_at_72%_32%,rgba(45,106,79,0.24),transparent_55%)]'
                : 'bg-[radial-gradient(circle_at_68%_28%,rgba(212,175,122,0.20),transparent_52%)]'
            }`}
          />

          {/* Lightweight Atmospheric Mist / Ember Particles */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className={`mist-particle-a absolute top-[28%] left-[12%] w-64 h-64 rounded-full blur-3xl ${
                isNight ? 'bg-emerald-500/15' : 'bg-[#D4AF7A]/15'
              }`}
            />
            <div
              className={`mist-particle-b absolute bottom-[22%] right-[16%] w-72 h-72 rounded-full blur-3xl ${
                isNight ? 'bg-amber-500/15' : 'bg-[#E8C588]/15'
              }`}
            />
          </div>

          {/* Top Hero Row: Location + Sliding Pill Ambiance Toggle */}
          <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 md:pt-4">
            <div className="inline-flex items-center gap-2 font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#E2EAE4]">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF7A] shrink-0" aria-hidden="true" />
              <span>{PROPERTY_CONFIG.location}</span>
            </div>

            {/* Compact Sliding Pill Ambiance Switcher with Rotating Sun / Moon */}
            <div
              role="group"
              aria-label="Hero ambiance lighting mode"
              className="relative grid grid-cols-2 p-1 rounded-full bg-[#0B1510]/85 border border-white/15 self-start sm:self-auto"
            >
              <span
                aria-hidden="true"
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isNight
                    ? 'translate-x-full bg-[#1D3529] border border-emerald-400/45 shadow-[0_0_18px_rgba(52,211,153,0.22)]'
                    : 'translate-x-0 bg-[#D4AF7A] shadow-[0_0_18px_rgba(212,175,122,0.35)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setAmbiance('golden')}
                aria-pressed={!isNight}
                data-testid="ambiance-golden-btn"
                className={`relative z-10 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${
                  !isNight ? 'text-[#0B1510]' : 'text-[#C8D3CC] hover:text-[#F4F1EA]'
                }`}
              >
                <Sun
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-500 ${
                    !isNight ? 'rotate-0 drop-shadow-[0_0_6px_rgba(11,21,16,0.4)]' : '-rotate-90 opacity-75'
                  }`}
                  aria-hidden="true"
                />
                <span>Golden Alpine Hour</span>
              </button>
              <button
                type="button"
                onClick={() => setAmbiance('night')}
                aria-pressed={isNight}
                data-testid="ambiance-night-btn"
                className={`relative z-10 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${
                  isNight ? 'text-[#F4F1EA]' : 'text-[#C8D3CC] hover:text-[#F4F1EA]'
                }`}
              >
                <Moon
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-500 ${
                    isNight ? 'rotate-0 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'rotate-45 opacity-75'
                  }`}
                  aria-hidden="true"
                />
                <span>Starlit Firepit Night</span>
              </button>
            </div>
          </div>

          {/* Center Hero Headline (Midground 1.0x + Floating Architectural Tag 1.15x) */}
          <div className="relative z-10 max-w-7xl w-full mx-auto my-auto py-5 sm:py-12 pl-0.5 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <ParallaxLayer speed={1.0} className="max-w-3xl space-y-3 sm:space-y-5">
              <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                {PROPERTY_CONFIG.elevation} · Architectural Retreat
              </p>

              <AnimatedHeadline
                as="h1"
                text={`${PROPERTY_CONFIG.cabinName} Above the Smoky Mountain Mist.`}
                italicWords={['Above', 'the', 'Smoky', 'Mountain', 'Mist']}
                active={heroRevealed}
                className="font-editorial text-[2.2rem] leading-[1.1] sm:text-5xl lg:text-6xl tracking-tight text-[#F4F1EA]"
              />

              <p
                className={`text-sm sm:text-base text-[#D7E0DA] max-w-xl leading-relaxed transition-opacity duration-700 delay-150 ${
                  heroRevealed ? 'opacity-100' : 'opacity-0'
                }`}
              >
                An engineered black-timber and Douglas fir A-frame perched at 3,400 feet with a private cliffside cedar barrel sauna, 104°F soaking tub, and direct WhatsApp host concierge.
              </p>

              <div
                className={`flex flex-wrap items-center gap-3 pt-1 transition-opacity duration-700 delay-200 ${
                  heroRevealed ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <MagneticButton
                  type="button"
                  variant="gold"
                  onClick={() => scrollToSection('reserve')}
                  className="px-5 sm:px-6 py-3 sm:py-3.5 shadow-xl"
                >
                  <span>Check Direct Availability</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </MagneticButton>
                <MagneticButton
                  type="button"
                  variant="glass"
                  onClick={() => scrollToSection('architecture')}
                  className="px-4 sm:px-5 py-3 sm:py-3.5"
                >
                  <Compass className="w-4 h-4 text-[#D4AF7A] shrink-0 group-hover:text-[#0B1510] transition-colors" aria-hidden="true" />
                  <span>Explore Spatial Plan</span>
                </MagneticButton>
              </div>
            </ParallaxLayer>

            {/* Foreground Floating Architectural Coordinate Card (1.15x Parallax, Desktop) */}
            <ParallaxLayer speed={1.15} className="hidden lg:block shrink-0">
              <div className="rounded-2xl border border-white/15 bg-[#0D1913]/80 backdrop-blur-md p-4 space-y-2 w-60 shadow-2xl">
                <p className="font-sans tracking-[0.14em] uppercase text-[10px] font-medium text-[#D4AF7A]">
                  Ridge Blueprint Spec
                </p>
                <p className="font-editorial text-2xl text-[#F4F1EA]">
                  {PROPERTY_CONFIG.coordinates}
                </p>
                <p className="text-xs text-[#B6C2BA]">
                  2,450 sq ft · Charred Black Larch · Direct WhatsApp Dispatch
                </p>
              </div>
            </ParallaxLayer>
          </div>

          {/* 2x2 Mobile Bento Telemetry Grid -> 4-Column Desktop HUD with Spotlight */}
          <div className="relative z-10 max-w-7xl w-full mx-auto pt-2">
            <div
              data-testid="architectural-hud"
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4"
            >
              <SpotlightCard className="bg-[#0D1913]/80 p-3 sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#D4AF7A]/15 border border-[#D4AF7A]/30 flex items-center justify-center shrink-0">
                    <Waves className="w-4 h-4 text-[#D4AF7A]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#F4F1EA] leading-tight">
                      {PROPERTY_CONFIG.hotTubTemp}
                    </p>
                    <p className="text-[11px] text-[#A2B1A8] mt-0.5 leading-tight">
                      Cedar Sauna
                    </p>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard className="bg-[#0D1913]/80 p-3 sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#D4AF7A]/15 border border-[#D4AF7A]/30 flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4 text-[#D4AF7A]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#F4F1EA] leading-tight">
                      {PROPERTY_CONFIG.wifiSpeed}
                    </p>
                    <p className="text-[11px] text-[#A2B1A8] mt-0.5 leading-tight">
                      Loft Mesh Wi-Fi
                    </p>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard className="bg-[#0D1913]/80 p-3 sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#D4AF7A]/15 border border-[#D4AF7A]/30 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-[#D4AF7A]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#F4F1EA] tabular-nums leading-tight">
                      {PROPERTY_CONFIG.rating}★ Superhost
                    </p>
                    <p className="text-[11px] text-[#A2B1A8] tabular-nums mt-0.5 leading-tight">
                      {PROPERTY_CONFIG.reviewCount} Verified Stays
                    </p>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard className="border-emerald-400/30 bg-[#0D1913]/80 p-3 sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-emerald-300 tabular-nums leading-tight">
                      {PROPERTY_CONFIG.airbnbFeePercent}% Savings
                    </p>
                    <p className="text-[11px] text-[#A2B1A8] mt-0.5 leading-tight">
                      $0 Platform Fees
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Sticky Scrollytelling 3-Chapter Architectural Story */}
        <ArchitecturalStory
          config={PROPERTY_CONFIG}
          onReserveClick={() => scrollToSection('reserve')}
        />

        {/* Interactive Spatial Hotspots ("Touch the Architecture") */}
        <SpatialHotspots
          config={PROPERTY_CONFIG}
          onReserveZone={() => scrollToSection('reserve')}
        />

        {/* Kinetic Marquee & Asymmetric 6-Panel Bento Gallery */}
        <BentoGallery config={PROPERTY_CONFIG} />

        {/* Verified Guest Stories & Hospitality Proof */}
        <section
          id="reviews"
          aria-labelledby="reviews-heading"
          className="scroll-mt-16 py-12 px-5 md:py-24 md:px-12 bg-[#0D1812] border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2.5 max-w-xl">
                <ScrollReveal variant="clip-up">
                  <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                    Guest Chronicle · {PROPERTY_CONFIG.rating}★ Across {PROPERTY_CONFIG.reviewCount} Stays
                  </p>
                </ScrollReveal>
                <AnimatedHeadline
                  id="reviews-heading"
                  as="h2"
                  text="Why returning guests skip the listing apps and message direct."
                  italicWords={['skip', 'direct']}
                  className="font-editorial text-3xl sm:text-4xl text-[#F4F1EA] leading-tight"
                />
              </div>
              <ScrollReveal variant="slide-horizontal" delay={120}>
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B6C2BA]">
                  <Flame className="w-4 h-4 text-[#D4AF7A] shrink-0" aria-hidden="true" />
                  <span>Direct Guests Receive Complimentary 2PM Late Checkout</span>
                </div>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {GUEST_REVIEWS.map((review, idx) => (
                <ScrollReveal key={review.id} variant="clip-up" delay={idx * 90}>
                  <SpotlightCard as="article" className="h-full bg-[#122019] p-5 sm:p-6">
                    <div className="h-full flex flex-col justify-between gap-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[#D4AF7A]" aria-label="5 out of 5 stars">
                          {[0, 1, 2, 3, 4].map((starIdx) => (
                            <Star key={starIdx} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                          ))}
                        </div>
                        <p className="text-sm text-[#DCE4DF] leading-relaxed">
                          &ldquo;{review.quote}&rdquo;
                        </p>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm font-semibold text-[#F4F1EA]">{review.guest}</p>
                        <p className="font-sans text-xs text-[#9CB0A4] mt-0.5">
                          {review.stayContext}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Zero-Lag Isolated Calendar & WhatsApp Concierge Engine */}
        <BookingConciergeEngine config={PROPERTY_CONFIG} />
      </main>

      {/* Quiet Architectural Footer (pb-24 mobile safe-area clearance above sticky mobile bar) */}
      <footer className="border-t border-white/10 bg-[#08100C] pt-10 pb-24 md:py-10 px-5 sm:px-8 lg:px-14 pl-7 md:pl-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#9CB0A4]">
          <div className="space-y-1">
            <p className="font-editorial text-lg text-[#F4F1EA]">
              {PROPERTY_CONFIG.cabinName}
            </p>
            <p className="font-sans text-xs">
              {PROPERTY_CONFIG.location} · Hosted Direct by {PROPERTY_CONFIG.hostName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('story')}
              className="hover:text-[#D4AF7A] transition-colors"
            >
              Story
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('architecture')}
              className="hover:text-[#D4AF7A] transition-colors"
            >
              Architecture
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('gallery')}
              className="hover:text-[#D4AF7A] transition-colors"
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('reserve')}
              className="hover:text-[#D4AF7A] transition-colors"
            >
              Direct Calendar
            </button>
            <button
              type="button"
              onClick={handleReplayIntro}
              className="inline-flex items-center gap-1.5 text-[#D4AF7A] hover:text-[#E5B869] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Replay Intro</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Airbnb-Luxe Sticky Mobile Bottom Booking Bar (md:hidden) */}
      <div
        data-testid="mobile-sticky-booking-bar"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B1510]/95 backdrop-blur-md border-t border-white/10 px-5 py-3.5 flex items-center justify-between gap-4"
      >
        <div className="min-w-0">
          <p className="font-sans tabular-nums text-sm font-semibold text-[#F4F1EA] truncate">
            ${PROPERTY_CONFIG.weekdayRate} / night
          </p>
          <p className="font-sans text-[11px] font-medium text-emerald-300 truncate">
            Save {PROPERTY_CONFIG.airbnbFeePercent}% Direct
          </p>
        </div>
        <button
          type="button"
          onClick={() => scrollToSection('reserve')}
          data-testid="mobile-sticky-check-dates-btn"
          className="px-5 py-2.5 rounded-xl bg-[#D4AF7A] hover:bg-[#E1BC89] text-[#0B1510] text-xs font-semibold whitespace-nowrap shrink-0 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA]"
        >
          Check Dates
        </button>
      </div>
    </div>
  );
}
