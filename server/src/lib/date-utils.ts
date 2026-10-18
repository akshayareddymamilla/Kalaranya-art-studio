/**
 * Date calculation and validation utilities.
 * All comparisons operate on calendar date boundaries (YYYY-MM-DD)
 * to avoid UTC/local time skew across client and server.
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

/**
 * Calculates calendar day difference: (targetDate - fromDate) in whole days.
 */
export function getDaysDifference(targetDateStr: string, fromDateStr: string = getTodayDateString()): number {
  const target = parseDateString(targetDateStr);
  const from = parseDateString(fromDateStr);
  const diffTime = target.getTime() - from.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Validates wall-painting booking date: 7 to 90 days from today.
 */
export function isBookingDateValid(bookingDateStr: string): { valid: boolean; reason?: string } {
  const days = getDaysDifference(bookingDateStr);
  if (days < 7) {
    return { valid: false, reason: 'Booking date must be at least 7 days from today.' };
  }
  if (days > 90) {
    return { valid: false, reason: 'Booking date cannot be more than 90 days in the future.' };
  }
  return { valid: true };
}

/**
 * Wall booking cancellation cutoff: customer can cancel until 3 days before the booking date.
 * Meaning at least 3 days remaining between today and the booking date.
 */
export function canCancelBooking(bookingDateStr: string): boolean {
  const days = getDaysDifference(bookingDateStr);
  return days >= 3;
}

/**
 * Validates custom pottery needed-by date: at least 14 days away from today.
 */
export function isPotteryDateValid(neededByDateStr: string): { valid: boolean; reason?: string } {
  const days = getDaysDifference(neededByDateStr);
  if (days < 14) {
    return { valid: false, reason: 'Needed-by date must be at least 14 days from today.' };
  }
  return { valid: true };
}
