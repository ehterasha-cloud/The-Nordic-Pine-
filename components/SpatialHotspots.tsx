'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Bath, Check, Coffee, Compass, Flame } from 'lucide-react';
import type { PropertyConfig } from '@/lib/booking-engine';
import {
  AnimatedHeadline,
  MagneticButton,
  ScrollReveal,
} from './MotionPrimitives';

interface SpatialZone {
  id: string;
  index: string;
  name: string;
  shortLabel: string;
  mobilePillLabel: string;
  positionClass: string;
  dimensions: string;
  elevationZone: string;
  description: string;
  image: string;
  specs: string[];
  icon: 'compass' | 'bath' | 'coffee' | 'flame';
}

interface SpatialHotspotsProps {
  config: PropertyConfig;
  onReserveZone: () => void;
}

export function SpatialHotspots({ config, onReserveZone }: SpatialHotspotsProps) {
  const zones: SpatialZone[] = [
    {
      id: 'stargazing-loft',
      index: '01',
      name: 'Panoramic Stargazing Loft',
      shortLabel: 'Apex Loft',
      mobilePillLabel: '01 Loft',
      positionClass: 'top-[22%] left-[68%]',
      dimensions: '480 sq ft · 24 ft Timber Apex',
      elevationZone: 'Upper Mezzanine',
      description:
        'Suspended beneath hand-oiled Douglas fir rafters, the king mezzanine frames uninterrupted Blue Ridge mist lines through triple-pane low-iron glass.',
      image: config.images.stargazingLoft,
      specs: ['King Organic Belgian Linen', 'Motorized Blackout Shades', 'Acoustic Cedar Soffits'],
      icon: 'compass',
    },
    {
      id: 'cedar-sauna',
      index: '02',
      name: 'Cliffside Cedar Barrel Sauna',
      shortLabel: 'Sauna & Hot Tub',
      mobilePillLabel: '02 Sauna',
      positionClass: 'top-[56%] left-[38%]',
      dimensions: '205°F Finnish Dry Heat · 104°F Tub',
      elevationZone: 'Cantilevered West Terrace',
      description:
        'Stepping straight from the Western red cedar barrel sauna into the steaming cliffside cedar soaking tub suspended over old-growth hemlock canopy.',
      image: config.images.cedarSauna,
      specs: ['Harvia Finnish Heater', '104°F Cedar Hot Tub Ready', 'Cold Rain Shower'],
      icon: 'bath',
    },
    {
      id: 'espresso-bar',
      index: '03',
      name: "Chef's Espresso & Wine Bar",
      shortLabel: 'Culinary Hearth',
      mobilePillLabel: '03 Hearth',
      positionClass: 'top-[51%] left-[72%]',
      dimensions: 'Honed Soapstone · Brass Machine',
      elevationZone: 'Great Room East',
      description:
        'Matte charcoal oak millwork paired with a commercial dual-boiler brass espresso station, temperature-controlled cellar shelving, and induction range.',
      image: config.images.espressoBar,
      specs: ['Dual-Boiler Brass Espresso', 'Local Smoky Mountain Roast', '36-Bottle Cellar Wall'],
      icon: 'coffee',
    },
    {
      id: 'firepit-deck',
      index: '04',
      name: 'Wrap-Around Firepit Deck',
      shortLabel: 'Firepit Lounge',
      mobilePillLabel: '04 Deck',
      positionClass: 'top-[76%] left-[60%]',
      dimensions: '940 sq ft Cantilevered Cedar',
      elevationZone: 'South Ridge Promontory',
      description:
        'Custom blackened-steel fire bowl anchored on a 940-square-foot cantilevered deck with sculpted oak armchairs and unobstructed sunset sightlines.',
      image: config.images.firepitDeck,
      specs: ['Seasoned Hickory Stack', 'Architectural Step Lighting', 'Merino Wool Throws'],
      icon: 'flame',
    },
  ];

  const [activeZoneId, setActiveZoneId] = useState<string>(zones[0].id);
  const activeZone = zones.find((z) => z.id === activeZoneId) ?? zones[0];

  const renderZoneIcon = (icon: SpatialZone['icon']) => {
    switch (icon) {
      case 'compass':
        return <Compass className="w-4 h-4 text-[#D4AF7A]" aria-hidden="true" />;
      case 'bath':
        return <Bath className="w-4 h-4 text-[#D4AF7A]" aria-hidden="true" />;
      case 'coffee':
        return <Coffee className="w-4 h-4 text-[#D4AF7A]" aria-hidden="true" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-[#D4AF7A]" aria-hidden="true" />;
    }
  };

  return (
    <section
      id="architecture"
      aria-labelledby="spatial-heading"
      className="scroll-mt-16 relative py-12 px-5 md:py-24 md:px-12 bg-[#0B1510] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <ScrollReveal variant="clip-up">
              <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                01. Touch the Architecture
              </p>
            </ScrollReveal>
            <AnimatedHeadline
              id="spatial-heading"
              as="h2"
              text="Four engineered sanctuaries across one 3,400-foot ridge."
              italicWords={['3,400-foot', 'ridge']}
              className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#F4F1EA] leading-[1.08]"
            />
          </div>

          <ScrollReveal variant="slide-horizontal" delay={120}>
            <p className="text-sm sm:text-base text-[#B6C2BA] max-w-md leading-relaxed">
              Select any golden sonar marker on the elevation plan to inspect interior photography, structural dimensions, and wellness systems.
            </p>
          </ScrollReveal>
        </div>

        {/* Interactive Spatial Canvas + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
          {/* Left Column: Photo + Mobile Thumb Pill Strip */}
          <ScrollReveal variant="blur-scale" className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#122019] min-h-[280px] sm:min-h-[460px] lg:min-h-[540px]">
              <Image
                src={config.images.heroGolden}
                alt={`${config.cabinName} interactive architectural elevation`}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                referrerPolicy="no-referrer"
                className="object-cover brightness-[0.82] contrast-[1.04]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0B1510]/80 via-[#0B1510]/15 to-[#0B1510]/30"
              />

              {/* Desktop Quick Zone Strip at Top Left */}
              <div className="hidden sm:flex relative z-10 p-5 flex-wrap gap-2">
                {zones.map((zone) => {
                  const isActive = zone.id === activeZone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setActiveZoneId(zone.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${
                        isActive
                          ? 'bg-[#D4AF7A] text-[#0B1510] shadow-lg'
                          : 'bg-[#0B1510]/75 text-[#E4EAE6] border border-white/15 hover:border-[#D4AF7A]/60'
                      }`}
                    >
                      {zone.index}. {zone.shortLabel}
                    </button>
                  );
                })}
              </div>

              {/* Well-Separated Glowing Sonar Pins */}
              {zones.map((zone) => {
                const isActive = zone.id === activeZone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setActiveZoneId(zone.id)}
                    aria-label={`Inspect ${zone.name}`}
                    aria-pressed={isActive}
                    data-testid={`sonar-node-${zone.id}`}
                    className={`group absolute ${zone.positionClass} -translate-x-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full active:scale-90 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-full border border-[#D4AF7A] sonar-ring ${
                        isActive ? 'opacity-95' : 'opacity-55'
                      }`}
                    />
                    <span
                      aria-hidden="true"
                      className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-transform duration-200 ${
                        isActive
                          ? 'bg-[#D4AF7A] text-[#0B1510] border-[#F4F1EA] scale-110 shadow-[0_0_22px_rgba(212,175,122,0.7)]'
                          : 'bg-[#0B1510]/85 text-[#D4AF7A] border-[#D4AF7A]/70 group-hover:scale-110'
                      }`}
                    >
                      <span className="font-sans tabular-nums text-[11px] sm:text-xs font-semibold">
                        {zone.index}
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Bottom Caption */}
              <div className="absolute bottom-3.5 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 z-10 flex items-center justify-between font-sans tracking-[0.14em] uppercase text-[11px] font-medium text-[#D5DDD8]">
                <span>Elevation Plan · Smoky Ridge</span>
                <span className="hidden sm:inline text-[#D4AF7A]">Select Pin to Inspect</span>
              </div>
            </div>

            {/* Mobile Horizontal Thumb Bar Directly Below Image */}
            <div
              role="tablist"
              aria-label="Architectural spaces selector"
              className="flex sm:hidden items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar py-1"
            >
              {zones.map((zone) => {
                const isActive = zone.id === activeZone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveZoneId(zone.id)}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${
                      isActive
                        ? 'bg-[#D4AF7A] text-[#0B1510]'
                        : 'bg-[#122019] text-[#D7E0DA] border border-white/15'
                    }`}
                  >
                    {zone.mobilePillLabel}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Right Column: Glassmorphic Detail Card with Clip-Path Wipe */}
          <div
            key={activeZone.id}
            data-testid="spatial-detail-card"
            className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/15 bg-[#122019]/90 overflow-hidden gpu-accelerated clip-wipe-in"
          >
            <div>
              <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-[#0B1510]">
                <Image
                  src={activeZone.image}
                  alt={activeZone.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  referrerPolicy="no-referrer"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#122019] via-[#122019]/20 to-black/25"
                />
                <div className="absolute bottom-3 left-5 right-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-sans tracking-[0.12em] uppercase text-[11px] font-medium text-[#D4AF7A]">
                  <span>{activeZone.elevationZone}</span>
                  <span>{activeZone.dimensions}</span>
                </div>
              </div>

              <div className="p-5 sm:p-7 space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#A8B5AD]">
                    {renderZoneIcon(activeZone.icon)}
                    <span>Zone {activeZone.index}</span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#F4F1EA] leading-tight">
                    {activeZone.name}
                  </h3>
                </div>

                <p className="text-sm sm:text-[15px] text-[#C8D3CC] leading-relaxed">
                  {activeZone.description}
                </p>

                <div className="pt-3 border-t border-white/10 space-y-2.5">
                  <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#A8B5AD]">
                    Architectural Specifications
                  </p>
                  <ul className="space-y-2">
                    {activeZone.specs.map((spec, specIdx) => (
                      <li
                        key={spec}
                        style={{ animationDelay: `${specIdx * 80}ms` }}
                        className="flex items-center gap-2.5 text-sm text-[#EDF2EE]"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#D4AF7A]/15 border border-[#D4AF7A]/40 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#D4AF7A] stroke-[3]" aria-hidden="true" />
                        </span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 sm:px-7 sm:pb-7">
              <MagneticButton
                type="button"
                onClick={onReserveZone}
                className="w-full px-5 py-3.5"
              >
                <span>Reserve Dates With This Sanctuary</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
