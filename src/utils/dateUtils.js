/**
 * Centralized date utilities for consistent UTC date handling.
 *
 * All dates in this app are "calendar dates" (not timestamps), so we
 * always store and display them in UTC to avoid timezone-shift issues.
 */

/**
 * Convert a date string (from DB or ISO) to YYYY-MM-DD for <input type="date">.
 * Interprets the date in UTC so it never shifts to the previous/next day.
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  // Use UTC methods to avoid timezone shift
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Convert a YYYY-MM-DD string (from date input) to an ISO string for storage.
 * Appends T00:00:00.000Z so the date is stored as UTC midnight — no local
 * timezone conversion involved.
 */
export const toUTCDateString = (dateString) => {
  if (!dateString) return "";
  // If already an ISO string with time component, parse and re-emit in UTC
  if (dateString.includes("T")) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString();
  }
  // For YYYY-MM-DD from date inputs, directly append UTC time
  return `${dateString}T00:00:00.000Z`;
};

/**
 * Get today's date as a YYYY-MM-DD string in UTC.
 * Use this instead of `new Date()` when you need "today" for a date field,
 * so that UTC formatting doesn't shift it to yesterday/tomorrow.
 */
export const getTodayUTC = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Calculate age from a date-of-birth string, using UTC methods.
 */
export const calculateAgeUTC = (dobString, referenceDate = new Date()) => {
  if (!dobString) return "";
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return "";

  const refYear = referenceDate.getUTCFullYear();
  const refMonth = referenceDate.getUTCMonth();
  const refDay = referenceDate.getUTCDate();

  const dobYear = dob.getUTCFullYear();
  const dobMonth = dob.getUTCMonth();
  const dobDay = dob.getUTCDate();

  let age = refYear - dobYear;
  const monthDiff = refMonth - dobMonth;

  if (monthDiff < 0 || (monthDiff === 0 && refDay < dobDay)) {
    age--;
  }

  return age;
};
