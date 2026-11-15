'use client';

import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  addDaysIso,
  buildMonthGrid,
  buildWhatsAppDispatchUrl,
  calculateStayQuote,
  diffNights,
  findNextAvailableRange,
  formatReadableDate,
  formatShortDate,
  formatWhatsAppTicket,
  getSyncedBlockedDates,
  rangeContainsBlockedDate,
  VIP_ADDONS,
  type PropertyConfig,
} from '@/lib/booking-engine';
import {
  AnimatedHeadline,
  AnimatedNumber,
  MagneticButton,
  ScrollReveal,
} from './MotionPrimitives';

interface BookingConciergeEngineProps {
  config: PropertyConfig;
}

const MONTH_OPTIONS = [
  { year: 2026, monthIndex: 10, label: 'November 2026' },
  { year: 2026, monthIndex: 11, label: 'December 2026' },
  { year: 2027, monthIndex: 0, label: 'January 2027' },
  { year: 2027, monthIndex: 1, label: 'February 2027' },
];

const TODAY_ISO = '2026-11-15';

function BookingConciergeEngineInner({ config }: BookingConciergeEngineProps) {
  const [monthCursor, setMonthCursor] = useState(0);
  const [checkIn, setCheckIn] = useState<string>('2026-11-16');
  const [checkOut, setCheckOut] = useState<string>('2026-11-18');
  const [selectingCheckout, setSelectingCheckout] = useState(false);
  const [selectionHint, setSelectionHint] = useState<string | null>(null);

  const [guests, setGuests] = useState<number>(2);
  const [guestPulseKey, setGuestPulseKey] = useState(0);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['late-checkout']);

  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [dispatchSent, setDispatchSent] = useState(false);

  const activeMonth = MONTH_OPTIONS[monthCursor];

  const allBlockedDates = useMemo(() => {
    const merged = new Set<string>();
    for (const m of MONTH_OPTIONS) {
      const monthBlocked = getSyncedBlockedDates(m.year, m.monthIndex);
      monthBlocked.forEach((d) => merged.add(d));
    }
    return merged;
  }, []);

  const monthGrid = useMemo(() => {
    const currentMonthBlocked = getSyncedBlockedDates(
      activeMonth.year,
      activeMonth.monthIndex
    );
    return buildMonthGrid(
      activeMonth.year,
      activeMonth.monthIndex,
      TODAY_ISO,
      currentMonthBlocked,
      config.weekdayRate,
      config.weekendRate
    );
  }, [activeMonth.year, activeMonth.monthIndex, config.weekdayRate, config.weekendRate]);

  const quote = useMemo(() => {
    return calculateStayQuote({
      checkIn,
      checkOut,
      weekdayRate: config.weekdayRate,
      weekendRate: config.weekendRate,
      cleaningFee: config.cleaningFee,
      airbnbFeePercent: config.airbnbFeePercent,
      selectedAddonIds,
    });
  }, [
    checkIn,
    checkOut,
    config.weekdayRate,
    config.weekendRate,
    config.cleaningFee,
    config.airbnbFeePercent,
    selectedAddonIds,
  ]);

  const formattedTicket = useMemo(() => {
    return formatWhatsAppTicket({
      cabinName: config.cabinName,
      location: config.location,
      guestName,
      guests,
      guestNote,
      quote,
      selectedAddonIds,
    });
  }, [config.cabinName, config.location, guestName, guests, guestNote, quote, selectedAddonIds]);

  const whatsappUrl = useMemo(() => {
    return buildWhatsAppDispatchUrl(config.whatsappNumber, formattedTicket);
  }, [config.whatsappNumber, formattedTicket]);

  const handleDayClick = (isoDate: string, isBlocked: boolean, isPast: boolean) => {
    if (isBlocked || isPast) return;
    setSelectionHint(null);

    if (!selectingCheckout || isoDate <= checkIn) {
      const twoNightsOut = addDaysIso(isoDate, 2);
      const oneNightOut = addDaysIso(isoDate, 1);
      if (!rangeContainsBlockedDate(isoDate, twoNightsOut, allBlockedDates, TODAY_ISO)) {
        setCheckIn(isoDate);
        setCheckOut(twoNightsOut);
      } else {
        setCheckIn(isoDate);
        setCheckOut(oneNightOut);
      }
      setSelectingCheckout(true);
      return;
    }

    const nights = diffNights(checkIn, isoDate);
    if (nights > 14) {
      setSelectionHint('Direct instant quotes support up to 14 nights — starting new check-in.');
      setCheckIn(isoDate);
      setCheckOut(addDaysIso(isoDate, 2));
      setSelectingCheckout(true);
      return;
    }

    if (rangeContainsBlockedDate(checkIn, isoDate, allBlockedDates, TODAY_ISO)) {
      setSelectionHint(
        `Dates between ${formatShortDate(checkIn)} and ${formatShortDate(isoDate)} cross Airbnb-synced reservations. Starting new check-in on ${formatShortDate(isoDate)}.`
      );
      const twoNightsOut = addDaysIso(isoDate, 2);
      setCheckIn(isoDate);
      setCheckOut(
        !rangeContainsBlockedDate(isoDate, twoNightsOut, allBlockedDates, TODAY_ISO)
          ? twoNightsOut
          : addDaysIso(isoDate, 1)
      );
      setSelectingCheckout(true);
      return;
    }

    setCheckOut(isoDate);
    setSelectingCheckout(false);
  };

  const handleSliderNights = (targetNights: number) => {
    setSelectionHint(null);
    const candidateOut = addDaysIso(checkIn, targetNights);
    if (!rangeContainsBlockedDate(checkIn, candidateOut, allBlockedDates, TODAY_ISO)) {
      setCheckOut(candidateOut);
      setSelectingCheckout(false);
      return;
    }

    const found =
      findNextAvailableRange(checkIn, targetNights, allBlockedDates, TODAY_ISO) ??
      findNextAvailableRange(TODAY_ISO, targetNights, allBlockedDates, TODAY_ISO);

    if (found) {
      setCheckIn(found.checkIn);
      setCheckOut(found.checkOut);
      setSelectingCheckout(false);
      setSelectionHint(
        `Adjusted to next open ${targetNights}-night window (${formatShortDate(found.checkIn)} – ${formatShortDate(found.checkOut)}) avoiding Airbnb-booked dates.`
      );
    } else {
      setSelectionHint(`No continuous ${targetNights}-night open block found in current window.`);
    }
  };

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyTicket = async () => {
    if (!guestName.trim()) {
      setNameError('Please enter your name so the host can personalize your reservation ticket.');
      return;
    }
    setNameError(null);
    try {
      await navigator.clipboard.writeText(formattedTicket);
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2600);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = formattedTicket;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2600);
    }
  };

  const handleLaunchWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!guestName.trim()) {
      e.preventDefault();
      setNameError('Please enter your name before launching WhatsApp.');
      return;
    }
    setNameError(null);
    setDispatchSent(true);
  };

  const sliderNightsValue = Math.min(10, Math.max(2, quote.nights));

  // Visual Fee-Arbitrage Bar & Radial Comparison Math
  const directBarPct =
    quote.airbnbTotal > 0
      ? Math.min(100, Math.round((quote.directTotal / quote.airbnbTotal) * 1000) / 10)
      : 86.6;
  const nightlySharePct =
    quote.airbnbTotal > 0
      ? Math.round((quote.nightlySubtotal / quote.airbnbTotal) * 1000) / 10
      : 72;
  const turnoverSharePct =
    quote.airbnbTotal > 0
      ? Math.round((quote.cleaningFee / quote.airbnbTotal) * 1000) / 10
      : 10;
  const addonsSharePct =
    quote.airbnbTotal > 0
      ? Math.round((quote.addonsTotal / quote.airbnbTotal) * 1000) / 10
      : 0;
  const feeSavedSharePct =
    quote.airbnbTotal > 0
      ? Math.max(0, Math.round((quote.savingsAmount / quote.airbnbTotal) * 1000) / 10)
      : 13.4;

  const ringRadius = 26;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringFillRatio = Math.min(1, config.airbnbFeePercent / 25);
  const ringOffset = ringCircumference * (1 - ringFillRatio);

  return (
    <section
      id="reserve"
      aria-labelledby="reserve-heading"
      className="scroll-mt-16 py-12 px-5 md:py-24 md:px-12 bg-[#0B1510] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        {/* Header + Live Sync Badge */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <ScrollReveal variant="clip-up">
              <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                03. Zero-Fee Direct Concierge
              </p>
            </ScrollReveal>
            <AnimatedHeadline
              id="reserve-heading"
              as="h2"
              text={`Lock in your dates direct. Keep the ${config.airbnbFeePercent}% platform fee.`}
              italicWords={['direct.', 'platform']}
              className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#F4F1EA] leading-[1.08]"
            />
          </div>

          <ScrollReveal variant="slide-horizontal" delay={100}>
            <div
              data-testid="live-calendar-sync-badge"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#122019] border border-emerald-500/30 self-start lg:self-auto"
            >
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="font-sans text-xs font-medium text-emerald-300 whitespace-nowrap">
                Live Calendar Sync · 0% Double-Booking Risk
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* Isolated 2-Column Booking Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Instant Interactive Calendar + 2-10 Night Slider */}
          <div className="lg:col-span-7 rounded-2xl border border-white/15 bg-[#111E17] p-5 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#D4AF7A]" aria-hidden="true" />
                <div>
                  <h3 className="font-editorial text-2xl text-[#F4F1EA]">
                    {activeMonth.label}
                  </h3>
                  <p className="font-sans text-xs text-[#A8B5AD]">
                    {selectingCheckout
                      ? `Select Check-Out after ${formatShortDate(checkIn)}`
                      : `Check-In: ${formatShortDate(checkIn)} · Check-Out: ${formatShortDate(checkOut)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthCursor((prev) => Math.max(0, prev - 1))}
                  disabled={monthCursor === 0}
                  aria-label="Previous month"
                  className="p-2 rounded-lg border border-white/15 text-[#F4F1EA] hover:bg-white/10 active:scale-90 disabled:opacity-35 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMonthCursor((prev) => Math.min(MONTH_OPTIONS.length - 1, prev + 1))
                  }
                  disabled={monthCursor === MONTH_OPTIONS.length - 1}
                  aria-label="Next month"
                  className="p-2 rounded-lg border border-white/15 text-[#F4F1EA] hover:bg-white/10 active:scale-90 disabled:opacity-35 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="font-sans tracking-[0.12em] uppercase text-[11px] font-medium text-[#95A39B] py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div
              role="grid"
              aria-label={`${activeMonth.label} availability calendar`}
              data-testid="booking-calendar-grid"
              className="grid grid-cols-7 gap-1.5"
            >
              {monthGrid.map((cell) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div
                      key={cell.isoDate}
                      aria-hidden="true"
                      className="h-12 sm:h-14 rounded-xl bg-white/[0.015] opacity-25 flex items-center justify-center font-sans tabular-nums text-xs text-[#8E9C94]"
                    >
                      {cell.dayOfMonth}
                    </div>
                  );
                }

                const isCheckIn = cell.isoDate === checkIn;
                const isCheckOut = cell.isoDate === checkOut;
                const isInRange = cell.isoDate > checkIn && cell.isoDate < checkOut;
                const isDisabled = cell.isBlocked || cell.isPast;

                let cellStyle =
                  'bg-[#17271E] text-[#F4F1EA] border-white/10 hover:border-[#D4AF7A]/70 hover:bg-[#1D3126] active:scale-95';
                if (cell.isBlocked) {
                  cellStyle =
                    'bg-[#0D1712] text-[#66756D] border-white/5 cursor-not-allowed line-through';
                } else if (cell.isPast) {
                  cellStyle = 'bg-transparent text-[#526058] border-transparent cursor-not-allowed';
                } else if (isCheckIn || isCheckOut) {
                  cellStyle =
                    'bg-[#D4AF7A] text-[#0B1510] border-[#F4F1EA] font-semibold shadow-md active:scale-95';
                } else if (isInRange) {
                  cellStyle =
                    'bg-[#D4AF7A]/20 text-[#F4F1EA] border-[#D4AF7A]/40 active:scale-95';
                }

                const statusLabel = cell.isBlocked
                  ? 'Booked (Synced with Airbnb)'
                  : cell.isPast
                  ? 'Past date'
                  : `$${cell.nightlyRate} direct rate`;

                return (
                  <button
                    key={cell.isoDate}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDayClick(cell.isoDate, cell.isBlocked, cell.isPast)}
                    aria-label={`${formatReadableDate(cell.isoDate)} - ${statusLabel}`}
                    aria-pressed={isCheckIn || isCheckOut || isInRange}
                    title={statusLabel}
                    data-testid={`calendar-day-${cell.isoDate}`}
                    className={`relative h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${cellStyle}`}
                  >
                    <span className="font-sans tabular-nums text-xs sm:text-sm leading-none">
                      {cell.dayOfMonth}
                    </span>
                    <span
                      className={`font-sans tabular-nums text-[10px] mt-1 leading-none ${
                        cell.isBlocked
                          ? 'text-[#6A7870]'
                          : isCheckIn || isCheckOut
                          ? 'text-[#0B1510]/85 font-semibold'
                          : 'text-[#9CB0A4]'
                      }`}
                    >
                      {cell.isBlocked ? 'Airbnb' : cell.isPast ? '' : `$${cell.nightlyRate}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs text-[#B6C2BA]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#D4AF7A]" aria-hidden="true" />
                  Selected Stay
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#17271E] border border-white/20" aria-hidden="true" />
                  Available Direct
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#0D1712] border border-white/10" aria-hidden="true" />
                  Booked (Synced with Airbnb)
                </span>
              </div>
              <span className="font-sans tabular-nums text-xs text-[#D4AF7A]">
                Fri–Sat ${config.weekendRate}/nt · Sun–Thu ${config.weekdayRate}/nt
              </span>
            </div>

            {selectionHint && (
              <div
                role="status"
                className="rounded-xl bg-[#D4AF7A]/10 border border-[#D4AF7A]/30 px-4 py-2.5 text-xs text-[#F3D79F]"
              >
                {selectionHint}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div className="rounded-xl bg-[#0D1812] border border-white/10 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="nights-quick-slider"
                    className="text-xs font-medium text-[#D7E0DA]"
                  >
                    Quick Stay Length
                  </label>
                  <span className="font-sans tabular-nums text-xs font-semibold text-[#D4AF7A]">
                    {quote.nights} {quote.nights === 1 ? 'Night' : 'Nights'}
                  </span>
                </div>
                <input
                  id="nights-quick-slider"
                  type="range"
                  min={2}
                  max={10}
                  value={sliderNightsValue}
                  onChange={(e) => handleSliderNights(Number(e.target.value))}
                  aria-label="Select number of nights from 2 to 10"
                  className="w-full accent-[#D4AF7A] cursor-pointer"
                />
                <div className="flex justify-between font-sans tabular-nums text-[11px] text-[#8E9C94]">
                  <span>2 nts</span>
                  <span>6 nts</span>
                  <span>10 nts</span>
                </div>
              </div>

              <div className="rounded-xl bg-[#0D1812] border border-white/10 p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#D7E0DA]">
                    <Users className="w-3.5 h-3.5 text-[#D4AF7A]" aria-hidden="true" />
                    <span>Guests</span>
                  </div>
                  <p className="font-sans text-[11px] text-[#95A39B]">
                    Max {config.maxGuests} guests
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGuests((g) => Math.max(1, g - 1));
                      setGuestPulseKey((k) => k + 1);
                    }}
                    disabled={guests <= 1}
                    aria-label="Decrease guest count"
                    className="relative w-9 h-9 rounded-lg border border-white/15 bg-[#17271E] text-[#F4F1EA] flex items-center justify-center hover:border-[#D4AF7A] active:scale-90 disabled:opacity-35 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span
                    key={guestPulseKey}
                    data-testid="guest-count-value"
                    className="relative font-sans tabular-nums text-sm font-semibold text-[#F4F1EA] w-7 h-7 flex items-center justify-center"
                  >
                    {guestPulseKey > 0 && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border border-[#D4AF7A] counter-ripple pointer-events-none"
                      />
                    )}
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setGuests((g) => Math.min(config.maxGuests, g + 1));
                      setGuestPulseKey((k) => k + 1);
                    }}
                    disabled={guests >= config.maxGuests}
                    aria-label="Increase guest count"
                    className="relative w-9 h-9 rounded-lg border border-white/15 bg-[#17271E] text-[#F4F1EA] flex items-center justify-center hover:border-[#D4AF7A] active:scale-90 disabled:opacity-35 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Savings Calculator + Visual Fee-Arbitrage Chart + VIP Add-Ons */}
          <div className="lg:col-span-5 rounded-2xl border border-[#D4AF7A]/30 bg-[#122019] p-5 sm:p-7 space-y-5">
            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/10">
              <div className="rounded-xl bg-[#0B1510]/80 border border-white/10 p-3">
                <p className="font-sans tracking-[0.14em] uppercase text-[11px] font-medium text-[#9CB0A4]">
                  Check-In
                </p>
                <p
                  data-testid="summary-checkin"
                  className="font-editorial text-xl text-[#F4F1EA] mt-0.5"
                >
                  {formatReadableDate(quote.checkIn)}
                </p>
              </div>
              <div className="rounded-xl bg-[#0B1510]/80 border border-white/10 p-3">
                <p className="font-sans tracking-[0.14em] uppercase text-[11px] font-medium text-[#9CB0A4]">
                  Check-Out
                </p>
                <p
                  data-testid="summary-checkout"
                  className="font-editorial text-xl text-[#F4F1EA] mt-0.5"
                >
                  {formatReadableDate(quote.checkOut)}
                </p>
              </div>
            </div>

            {/* Interactive Visual Fee-Arbitrage Bar & Radial Comparison Chart */}
            <div
              data-testid="fee-arbitrage-chart"
              className="rounded-xl bg-[#0B1510] border border-white/10 p-4 space-y-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="font-sans tracking-[0.14em] uppercase text-[11px] font-medium text-[#D4AF7A]">
                    Live Fee-Arbitrage Breakdown
                  </p>
                  <p className="text-xs text-[#B6C2BA]">
                    Direct Host vs. Marketplace Markup
                  </p>
                </div>

                {/* SVG Radial Markup-Avoided Ring */}
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 64 64" className="w-14 h-14 -rotate-90" aria-hidden="true">
                    <circle
                      cx="32"
                      cy="32"
                      r={ringRadius}
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4.5"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r={ringRadius}
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      className="transition-[stroke-dashoffset] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  </svg>
                  <span className="absolute font-sans tabular-nums text-[11px] font-semibold text-emerald-300">
                    -{config.airbnbFeePercent}%
                  </span>
                </div>
              </div>

              {/* Animated Horizontal Comparison Bars */}
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#F4F1EA]">
                      Direct Host Quote ($0 Fee)
                    </span>
                    <span className="font-sans tabular-nums font-semibold text-[#D4AF7A]">
                      <AnimatedNumber value={quote.directTotal} prefix="$" />
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden flex">
                    <div
                      style={{ width: `${nightlySharePct}%` }}
                      className="h-full bg-[#D4AF7A] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      title="Nightly Stay"
                    />
                    <div
                      style={{ width: `${turnoverSharePct}%` }}
                      className="h-full bg-[#B38F5E] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      title="Turnover Prep"
                    />
                    {addonsSharePct > 0 && (
                      <div
                        style={{ width: `${addonsSharePct}%` }}
                        className="h-full bg-emerald-400 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        title="VIP Add-Ons"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#A8B5AD]">
                      Airbnb / Vrbo Checkout (+{config.airbnbFeePercent}%)
                    </span>
                    <span className="font-sans tabular-nums text-rose-400 line-through">
                      <AnimatedNumber value={quote.airbnbTotal} prefix="$" />
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden flex">
                    <div
                      style={{ width: `${directBarPct}%` }}
                      className="h-full bg-white/25 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                    <div
                      style={{ width: `${feeSavedSharePct}%` }}
                      className="h-full bg-rose-500/80 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      title="Marketplace Service Fee"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Breakdown Legend Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-medium text-[#B6C2BA]">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF7A]" aria-hidden="true" />
                  Stay {nightlySharePct.toFixed(0)}%
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5">
                  <span className="w-2 h-2 rounded-full bg-[#B38F5E]" aria-hidden="true" />
                  Prep {turnoverSharePct.toFixed(0)}%
                </span>
                {addonsSharePct > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    VIP {addonsSharePct.toFixed(0)}%
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-400" aria-hidden="true" />
                  Junk Fee Avoided
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                VIP Direct Experience Add-Ons
              </p>
              <div className="space-y-2">
                {VIP_ADDONS.map((addon) => {
                  const active = selectedAddonIds.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      aria-pressed={active}
                      data-testid={`addon-toggle-${addon.id}`}
                      className={`w-full text-left rounded-xl border p-3.5 active:scale-[0.99] transition-all duration-150 flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A] ${
                        active
                          ? 'bg-[#D4AF7A]/12 border-[#D4AF7A]/60'
                          : 'bg-[#0D1812] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors duration-200 ${
                            active
                              ? 'bg-[#D4AF7A] border-[#D4AF7A] text-[#0B1510]'
                              : 'border-white/30 bg-transparent'
                          }`}
                        >
                          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                            <path
                              d="M2.5 6.2L5 8.6L9.5 3.6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="16"
                              strokeDashoffset={active ? 0 : 16}
                              className="transition-[stroke-dashoffset] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            />
                          </svg>
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-[#F4F1EA]">
                            {addon.label}
                          </p>
                          <p className="text-[11px] text-[#A2B1A8] mt-0.5 leading-snug">
                            {addon.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className="font-sans tabular-nums text-xs font-semibold text-[#D4AF7A] whitespace-nowrap shrink-0">
                        {addon.priceLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-[#0B1510] border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#C6D1CA]">
                <span>
                  {quote.nights} {quote.nights === 1 ? 'Night' : 'Nights'} ({quote.weekdayNights}{' '}
                  weekday, {quote.weekendNights} weekend)
                </span>
                <span className="font-sans tabular-nums">
                  <AnimatedNumber value={quote.nightlySubtotal} prefix="$" />
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#C6D1CA]">
                <span>Sanctuary Turnover & Hot Tub Prep</span>
                <span className="font-sans tabular-nums">${quote.cleaningFee.toLocaleString()}</span>
              </div>
              {quote.addonsTotal > 0 && (
                <div className="flex items-center justify-between text-xs text-[#C6D1CA]">
                  <span>Selected VIP Add-Ons</span>
                  <span className="font-sans tabular-nums">
                    <AnimatedNumber value={quote.addonsTotal} prefix="$" />
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B6C2BA]">
                    Airbnb / Vrbo Price (+{config.airbnbFeePercent}% platform fee)
                  </span>
                  <span
                    data-testid="airbnb-crossed-price"
                    className="font-sans tabular-nums text-sm font-medium text-rose-400 line-through"
                  >
                    <AnimatedNumber value={quote.airbnbTotal} prefix="$" />
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#F4F1EA]">
                      Official Direct Host Price
                    </p>
                    <p className="font-sans text-xs text-emerald-400">
                      $0 Platform Fees · Direct Host Verified
                    </p>
                  </div>
                  <span
                    data-testid="direct-host-price"
                    className="font-editorial tabular-nums text-4xl text-[#D4AF7A]"
                  >
                    <AnimatedNumber value={quote.directTotal} prefix="$" />
                  </span>
                </div>
              </div>

              <div
                data-testid="direct-savings-badge"
                className="mt-2 rounded-lg bg-emerald-500/15 border border-emerald-400/35 px-3.5 py-2.5 flex items-center justify-between gap-2"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-300" aria-hidden="true" />
                  <span>
                    You Save <AnimatedNumber value={quote.savingsAmount} prefix="$" /> By Messaging
                    the Host Direct!
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <MagneticButton
                type="button"
                onClick={() => {
                  setDispatchSent(false);
                  setNameError(null);
                  setIsDispatchOpen(true);
                }}
                data-testid="open-whatsapp-dispatch-btn"
                className="w-full px-6 py-4 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Request These Dates via Host WhatsApp</span>
              </MagneticButton>
              <p className="text-center text-xs text-[#9CB0A4]">
                No card required today · Direct confirmation from host {config.hostName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click WhatsApp Reservation Dispatch Modal */}
      {isDispatchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dispatch-modal-title"
          data-testid="whatsapp-dispatch-modal"
          className="fixed inset-0 z-50 bg-[#050A07]/85 flex items-center justify-center p-4 sm:p-6 overflow-y-auto clip-wipe-in"
        >
          <div className="w-full max-w-xl rounded-2xl border border-[#D4AF7A]/35 bg-[#101C16] p-6 sm:p-7 space-y-5 shadow-2xl my-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <p className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#D4AF7A]">
                  Direct Host Concierge Dispatch
                </p>
                <h3 id="dispatch-modal-title" className="font-editorial text-3xl text-[#F4F1EA]">
                  Review & Send Reservation Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDispatchOpen(false)}
                aria-label="Close reservation dispatch modal"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-[#F4F1EA] active:scale-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="dispatch-guest-name"
                  className="block text-xs font-medium text-[#E4EAE6]"
                >
                  Your Full Name *
                </label>
                <input
                  id="dispatch-guest-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (nameError && e.target.value.trim()) setNameError(null);
                  }}
                  placeholder="e.g. Claire Sterling"
                  className="w-full rounded-xl bg-[#0B1510] border border-white/15 px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#6C7B72] focus:outline-none focus:border-[#D4AF7A]"
                />
                {nameError && (
                  <p role="alert" className="text-xs text-rose-400">
                    {nameError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="dispatch-guest-note"
                  className="block text-xs font-medium text-[#E4EAE6]"
                >
                  Optional Arrival Note or Special Occasion
                </label>
                <input
                  id="dispatch-guest-note"
                  type="text"
                  value={guestNote}
                  onChange={(e) => setGuestNote(e.target.value)}
                  placeholder="e.g. Anniversary getaway, arriving around 5 PM"
                  className="w-full rounded-xl bg-[#0B1510] border border-white/15 px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#6C7B72] focus:outline-none focus:border-[#D4AF7A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans tracking-[0.14em] uppercase text-xs font-medium text-[#A8B5AD]">
                  Formatted WhatsApp Ticket Preview
                </span>
                <span className="font-sans tabular-nums text-xs font-medium text-emerald-400">
                  Saving ${quote.savingsAmount.toLocaleString()}
                </span>
              </div>
              <pre
                data-testid="whatsapp-ticket-preview"
                className="rounded-xl bg-[#08100C] border border-white/10 p-4 text-xs font-sans text-[#D6DFD9] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto"
              >
                {formattedTicket}
              </pre>
            </div>

            {dispatchSent && (
              <div
                role="status"
                className="rounded-xl bg-emerald-500/15 border border-emerald-400/35 px-4 py-3 flex items-center gap-2.5 text-xs text-emerald-300"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  WhatsApp dispatch opened for {config.hostName}. You can also copy the ticket below as a backup.
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLaunchWhatsAppClick}
                data-testid="launch-whatsapp-btn"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#D4AF7A] hover:bg-[#E1BC89] text-[#0B1510] font-semibold text-sm whitespace-nowrap active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Launch WhatsApp & Lock In Dates</span>
              </a>

              <button
                type="button"
                onClick={handleCopyTicket}
                data-testid="copy-ticket-btn"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[#F4F1EA] font-medium text-sm whitespace-nowrap active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]"
              >
                {copiedTicket ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                    <span>Ticket Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Copy Reservation Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export const BookingConciergeEngine = React.memo(BookingConciergeEngineInner);
