import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMonthGrid,
  buildWhatsAppDispatchUrl,
  calculateStayQuote,
  diffNights,
  findNextAvailableRange,
  formatWhatsAppTicket,
  getSyncedBlockedDates,
  rangeContainsBlockedDate,
} from './booking-engine';

test('diffNights calculates exact night count across month boundaries', () => {
  assert.equal(diffNights('2026-11-29', '2026-12-02'), 3);
  assert.equal(diffNights('2026-11-16', '2026-11-18'), 2);
});

test('calculateStayQuote computes weekday/weekend split, add-ons, and 15.5% Airbnb fee savings', () => {
  // 2026-11-19 (Thu - weekday $445), 2026-11-20 (Fri - weekend $565), 2026-11-21 (Sat - weekend $565)
  const quote = calculateStayQuote({
    checkIn: '2026-11-19',
    checkOut: '2026-11-22',
    weekdayRate: 445,
    weekendRate: 565,
    cleaningFee: 145,
    airbnbFeePercent: 15.5,
    selectedAddonIds: ['late-checkout', 'firewood-smores'],
  });

  assert.equal(quote.nights, 3);
  assert.equal(quote.weekdayNights, 1);
  assert.equal(quote.weekendNights, 2);
  assert.equal(quote.nightlySubtotal, 445 + 565 * 2);
  assert.equal(quote.addonsTotal, 45);
  assert.equal(quote.directTotal, 445 + 1130 + 145 + 45); // 1765
  assert.equal(quote.airbnbFeeAmount, Math.round(1765 * 0.155)); // 274
  assert.equal(quote.airbnbTotal, 1765 + 274);
  assert.equal(quote.savingsAmount, 274);
});

test('rangeContainsBlockedDate detects Airbnb-synced blocked nights and past dates', () => {
  const blocked = getSyncedBlockedDates(2026, 10); // Nov 2026
  const todayIso = '2026-11-15';

  // Nov 16-18 is open
  assert.equal(rangeContainsBlockedDate('2026-11-16', '2026-11-18', blocked, todayIso), false);
  // Nov 18-21 crosses Nov 19 & 20 which are blocked
  assert.equal(rangeContainsBlockedDate('2026-11-18', '2026-11-21', blocked, todayIso), true);
  // Past date check
  assert.equal(rangeContainsBlockedDate('2026-11-14', '2026-11-16', blocked, todayIso), true);
});

test('findNextAvailableRange locates a clean contiguous N-night window', () => {
  const blocked = new Set([
    ...getSyncedBlockedDates(2026, 10),
    ...getSyncedBlockedDates(2026, 11),
  ]);
  const window3 = findNextAvailableRange('2026-11-15', 3, blocked, '2026-11-15');
  assert.ok(window3);
  assert.equal(diffNights(window3.checkIn, window3.checkOut), 3);
  assert.equal(
    rangeContainsBlockedDate(window3.checkIn, window3.checkOut, blocked, '2026-11-15'),
    false
  );
});

test('buildMonthGrid aligns to 7-day weeks and flags blocked dates accurately', () => {
  const blocked = getSyncedBlockedDates(2026, 10);
  const grid = buildMonthGrid(2026, 10, '2026-11-15', blocked, 445, 565);
  assert.equal(grid.length % 7, 0);
  const nov19 = grid.find((c) => c.isoDate === '2026-11-19');
  const nov16 = grid.find((c) => c.isoDate === '2026-11-16');
  assert.ok(nov19 && nov19.isBlocked === true);
  assert.ok(nov16 && nov16.isBlocked === false && nov16.isPast === false);
});

test('formatWhatsAppTicket and buildWhatsAppDispatchUrl encode complete inquiry payload', () => {
  const quote = calculateStayQuote({
    checkIn: '2026-11-22',
    checkOut: '2026-11-25',
    weekdayRate: 445,
    weekendRate: 565,
    cleaningFee: 145,
    airbnbFeePercent: 15.5,
    selectedAddonIds: ['late-checkout'],
  });
  const ticket = formatWhatsAppTicket({
    cabinName: 'The Nordic Pine A-Frame',
    location: 'Smoky Mountains, TN',
    guestName: 'Elena Vance',
    guests: 4,
    guestNote: 'Anniversary weekend',
    quote,
    selectedAddonIds: ['late-checkout'],
  });

  assert.match(ticket, /The Nordic Pine A-Frame/);
  assert.match(ticket, /Elena Vance \(4 Guests\)/);
  assert.match(ticket, /Complimentary 2PM Late Checkout/);
  assert.match(ticket, /\$0 Platform Fees/);
  assert.match(ticket, /Anniversary weekend/);

  const url = buildWhatsAppDispatchUrl('+1 (865) 555-0194', ticket);
  assert.ok(url.startsWith('https://wa.me/18655550194?text='));
});
