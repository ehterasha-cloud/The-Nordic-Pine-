export interface PropertyAddon {
  id: string;
  label: string;
  subtitle: string;
  price: number;
  priceLabel: string;
}

export interface PropertyConfig {
  cabinName: string;
  tagline: string;
  location: string;
  coordinates: string;
  elevation: string;
  whatsappNumber: string;
  hostName: string;
  weekdayRate: number;
  weekendRate: number;
  cleaningFee: number;
  airbnbFeePercent: number;
  rating: string;
  reviewCount: number;
  maxGuests: number;
  wifiSpeed: string;
  hotTubTemp: string;
  images: {
    heroGolden: string;
    heroNight: string;
    stargazingLoft: string;
    cedarSauna: string;
    espressoBar: string;
    firepitDeck: string;
  };
}

export interface CalendarDayCell {
  isoDate: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isBlocked: boolean;
  isWeekend: boolean;
  nightlyRate: number;
}

export interface StayQuote {
  checkIn: string;
  checkOut: string;
  nights: number;
  weekdayNights: number;
  weekendNights: number;
  nightlySubtotal: number;
  cleaningFee: number;
  addonsTotal: number;
  directTotal: number;
  airbnbFeeAmount: number;
  airbnbTotal: number;
  savingsAmount: number;
}

export const VIP_ADDONS: PropertyAddon[] = [
  {
    id: 'late-checkout',
    label: 'Complimentary 2PM Late Checkout',
    subtitle: 'Slow morning espresso & final sauna session included free for direct guests',
    price: 0,
    priceLabel: '$0',
  },
  {
    id: 'firewood-smores',
    label: "Pre-Stocked Firewood & S'mores Kit",
    subtitle: 'Seasoned Tennessee hickory stack, firestarters & artisanal marshmallow crate',
    price: 45,
    priceLabel: '+$45',
  },
  {
    id: 'chef-massage-inquiry',
    label: 'Private In-Cabin Massage / Chef Inquiry',
    subtitle: 'Host coordinates availability with our vetted Smoky Mountain practitioners',
    price: 0,
    priceLabel: '+$0 Quote',
  },
];

export function formatIsoDate(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseIsoDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDaysIso(isoDate: string, days: number): string {
  const dt = parseIsoDate(isoDate);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function diffNights(checkIn: string, checkOut: string): number {
  const start = parseIsoDate(checkIn).getTime();
  const end = parseIsoDate(checkOut).getTime();
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

export function formatReadableDate(isoDate: string): string {
  const dt = parseIsoDate(isoDate);
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatShortDate(isoDate: string): string {
  const dt = parseIsoDate(isoDate);
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Deterministic Airbnb-synced blocked dates per month so calendar availability
 * stays realistic and immediately testable without external API flakiness.
 */
export function getSyncedBlockedDates(year: number, monthIndex: number): Set<string> {
  const blockedDaysByOffset: Record<number, number[]> = {
    0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 20, 26, 27, 28],
    1: [3, 4, 5, 11, 12, 18, 19, 20, 24, 25, 26, 27],
    2: [1, 2, 8, 9, 15, 16, 17, 22, 23, 29, 30],
    3: [5, 6, 7, 13, 14, 15, 20, 21, 26, 27],
  };

  const baseYear = 2026;
  const baseMonth = 10; // November 2026
  const monthOffset = (year - baseYear) * 12 + (monthIndex - baseMonth);
  const days = blockedDaysByOffset[monthOffset] ?? [4, 5, 14, 15, 23, 24];
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const set = new Set<string>();
  for (const d of days) {
    if (d <= daysInMonth) {
      set.add(formatIsoDate(year, monthIndex, d));
    }
  }
  return set;
}

export function isWeekendNight(isoDate: string): boolean {
  const day = parseIsoDate(isoDate).getUTCDay();
  // Friday (5) and Saturday (6) nights carry weekend rate
  return day === 5 || day === 6;
}

export function getNightlyRate(
  isoDate: string,
  weekdayRate: number,
  weekendRate: number
): number {
  return isWeekendNight(isoDate) ? weekendRate : weekdayRate;
}

export function buildMonthGrid(
  year: number,
  monthIndex: number,
  todayIso: string,
  blockedDates: Set<string>,
  weekdayRate: number,
  weekendRate: number
): CalendarDayCell[] {
  const firstDayOfWeek = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: CalendarDayCell[] = [];

  // Leading blank days from previous month for aligned 7-column grid
  const prevMonthDays = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevDate = new Date(Date.UTC(year, monthIndex - 1, day));
    const iso = prevDate.toISOString().slice(0, 10);
    cells.push({
      isoDate: iso,
      dayOfMonth: day,
      isCurrentMonth: false,
      isPast: iso < todayIso,
      isBlocked: blockedDates.has(iso),
      isWeekend: isWeekendNight(iso),
      nightlyRate: getNightlyRate(iso, weekdayRate, weekendRate),
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = formatIsoDate(year, monthIndex, d);
    cells.push({
      isoDate: iso,
      dayOfMonth: d,
      isCurrentMonth: true,
      isPast: iso < todayIso,
      isBlocked: blockedDates.has(iso),
      isWeekend: isWeekendNight(iso),
      nightlyRate: getNightlyRate(iso, weekdayRate, weekendRate),
    });
  }

  // Trailing days to complete final week row
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const fill = 7 - remainder;
    for (let d = 1; d <= fill; d++) {
      const nextDate = new Date(Date.UTC(year, monthIndex + 1, d));
      const iso = nextDate.toISOString().slice(0, 10);
      cells.push({
        isoDate: iso,
        dayOfMonth: d,
        isCurrentMonth: false,
        isPast: iso < todayIso,
        isBlocked: blockedDates.has(iso),
        isWeekend: isWeekendNight(iso),
        nightlyRate: getNightlyRate(iso, weekdayRate, weekendRate),
      });
    }
  }

  return cells;
}

export function rangeContainsBlockedDate(
  checkIn: string,
  checkOut: string,
  blockedDates: Set<string>,
  todayIso: string
): boolean {
  const nights = diffNights(checkIn, checkOut);
  if (nights <= 0) return true;
  for (let i = 0; i < nights; i++) {
    const nightIso = addDaysIso(checkIn, i);
    if (nightIso < todayIso || blockedDates.has(nightIso)) {
      return true;
    }
  }
  return false;
}

export function findNextAvailableRange(
  startFromIso: string,
  nights: number,
  blockedDates: Set<string>,
  todayIso: string,
  maxSearchDays = 90
): { checkIn: string; checkOut: string } | null {
  const initial = startFromIso < todayIso ? todayIso : startFromIso;
  for (let offset = 0; offset <= maxSearchDays; offset++) {
    const candidateIn = addDaysIso(initial, offset);
    const candidateOut = addDaysIso(candidateIn, nights);
    if (!rangeContainsBlockedDate(candidateIn, candidateOut, blockedDates, todayIso)) {
      return { checkIn: candidateIn, checkOut: candidateOut };
    }
  }
  return null;
}

export function calculateStayQuote(params: {
  checkIn: string;
  checkOut: string;
  weekdayRate: number;
  weekendRate: number;
  cleaningFee: number;
  airbnbFeePercent: number;
  selectedAddonIds: string[];
  addons?: PropertyAddon[];
}): StayQuote {
  const {
    checkIn,
    checkOut,
    weekdayRate,
    weekendRate,
    cleaningFee,
    airbnbFeePercent,
    selectedAddonIds,
    addons = VIP_ADDONS,
  } = params;

  const nights = Math.max(1, diffNights(checkIn, checkOut));
  let weekdayNights = 0;
  let weekendNights = 0;
  let nightlySubtotal = 0;

  for (let i = 0; i < nights; i++) {
    const nightIso = addDaysIso(checkIn, i);
    if (isWeekendNight(nightIso)) {
      weekendNights += 1;
      nightlySubtotal += weekendRate;
    } else {
      weekdayNights += 1;
      nightlySubtotal += weekdayRate;
    }
  }

  const addonsTotal = addons
    .filter((addon) => selectedAddonIds.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0);

  const directTotal = nightlySubtotal + cleaningFee + addonsTotal;
  const airbnbFeeAmount = Math.round(directTotal * (airbnbFeePercent / 100));
  const airbnbTotal = directTotal + airbnbFeeAmount;

  return {
    checkIn,
    checkOut,
    nights,
    weekdayNights,
    weekendNights,
    nightlySubtotal,
    cleaningFee,
    addonsTotal,
    directTotal,
    airbnbFeeAmount,
    airbnbTotal,
    savingsAmount: airbnbFeeAmount,
  };
}

export function formatWhatsAppTicket(params: {
  cabinName: string;
  location: string;
  guestName: string;
  guests: number;
  guestNote: string;
  quote: StayQuote;
  selectedAddonIds: string[];
  addons?: PropertyAddon[];
}): string {
  const {
    cabinName,
    location,
    guestName,
    guests,
    guestNote,
    quote,
    selectedAddonIds,
    addons = VIP_ADDONS,
  } = params;

  const chosenAddons = addons.filter((a) => selectedAddonIds.includes(a.id));
  const addonLines =
    chosenAddons.length > 0
      ? chosenAddons.map((a) => `• ${a.label} (${a.priceLabel})`).join('\n')
      : '• Standard Direct Stay Perks Included';

  const cleanName = guestName.trim() || 'Prospective Guest';
  const noteSection = guestNote.trim() ? `\nGuest Note: ${guestNote.trim()}` : '';

  return [
    `DIRECT RESERVATION INQUIRY — ${cabinName}`,
    `Location: ${location}`,
    ``,
    `Guest: ${cleanName} (${guests} ${guests === 1 ? 'Guest' : 'Guests'})`,
    `Check-In: ${formatReadableDate(quote.checkIn)} (4:00 PM)`,
    `Check-Out: ${formatReadableDate(quote.checkOut)}`,
    `Duration: ${quote.nights} Nights (${quote.weekdayNights} weekday, ${quote.weekendNights} weekend)`,
    ``,
    `Selected Direct Perks:`,
    addonLines,
    ``,
    `Official Direct Host Price: $${quote.directTotal.toLocaleString()} ($0 Platform Fees)`,
    `Airbnb/Vrbo Equivalent: $${quote.airbnbTotal.toLocaleString()}`,
    `Total Direct Savings: $${quote.savingsAmount.toLocaleString()}${noteSection}`,
    ``,
    `Please confirm availability so we can lock in these dates direct.`,
  ].join('\n');
}

export function buildWhatsAppDispatchUrl(whatsappNumber: string, ticket: string): string {
  const cleanDigits = whatsappNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(ticket)}`;
}
