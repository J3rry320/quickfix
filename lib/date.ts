/**
 * QuickFix IST Date & Time Utilities
 * All bookings and operational cutoffs operate strictly in Indian Standard Time (Asia/Kolkata, UTC+5:30).
 */

export const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Operating cutoff limits in minutes from midnight (IST):
 * - Morning window cutoff: 12:30 PM (750 mins)
 * - Afternoon window cutoff: 3:30 PM (930 mins)
 * - Evening window cutoff: 7:30 PM (1170 mins)
 * - Express dispatch daily closing cutoff: 8:15 PM (1215 mins)
 */
export const CUTOFFS = {
  MORNING_MINUTES: 750,
  AFTERNOON_MINUTES: 930,
  EVENING_MINUTES: 1170,
  EXPRESS_MINUTES: 1215,
} as const;

/**
 * Returns a date string formatted as YYYY-MM-DD in Asia/Kolkata timezone,
 * optionally offset by N calendar days (0 = today, 1 = tomorrow, etc.).
 */
export function getIstDateString(offsetDays: number = 0, baseDate: Date = new Date()): string {
  const d = new Date(baseDate);
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Returns the current time in minutes from midnight (0 - 1439) in Asia/Kolkata timezone.
 */
export function getIstMinutesFromMidnight(baseDate: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: IST_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(baseDate);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
  return hour * 60 + minute;
}

/**
 * Converts a date string or Date object into a Date object safely positioned
 * at midday IST (12:00:00+05:30 = 06:30:00 UTC).
 * Midday IST ensures that the UTC calendar day and the IST calendar day are identical,
 * avoiding edge-case calendar rollbacks across all global client timezones.
 */
export function parseIstDateMidday(dateInput: string | Date): Date {
  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) return dateInput;
    const dateStr = getIstDateString(0, dateInput);
    return new Date(`${dateStr}T12:00:00+05:30`);
  }
  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return new Date(`${trimmed}T12:00:00+05:30`);
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      const dateStr = getIstDateString(0, d);
      return new Date(`${dateStr}T12:00:00+05:30`);
    }
  }
  return new Date(dateInput);
}

/**
 * Formats a date for end-user display in Indian Standard Time (IST),
 * localized according to user's locale (en, hi, mr).
 * Example outputs:
 *  - "Wed, 23 Sep 2026" (en)
 *  - "बुध, 23 सित॰ 2026" (hi)
 *  - "बुध, 23 सप्टें 2026" (mr)
 */
export function formatIstDisplayDate(dateInput: string | Date, locale: string = "en"): string {
  if (!dateInput) return "";
  let dateObj: Date;
  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      dateObj = new Date(`${trimmed}T12:00:00+05:30`);
    } else {
      dateObj = new Date(trimmed);
    }
  } else {
    dateObj = dateInput;
  }

  if (isNaN(dateObj.getTime())) return String(dateInput);

  const loc = locale === "hi" ? "hi-IN" : locale === "mr" ? "mr-IN" : "en-IN";
  return new Intl.DateTimeFormat(loc, {
    timeZone: IST_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dateObj);
}
