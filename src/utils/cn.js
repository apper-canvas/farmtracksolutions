import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Safely formats a date with validation
 * @param {any} date - Date value to format (Date object, string, or timestamp)
 * @param {string} formatString - date-fns format string
 * @param {string} fallback - Fallback text if date is invalid (default: "N/A")
 * @returns {string} Formatted date string or fallback
 */
export function safeFormatDate(date, formatString = "MMM dd, yyyy", fallback = "N/A") {
  if (!date) return fallback;
  
  try {
    const dateObj = safeParseDate(date);
    if (!dateObj || !isValid(dateObj)) return fallback;
    return format(dateObj, formatString);
  } catch (error) {
    return fallback;
  }
}

/**
 * Safely parses various date inputs into Date object
 * @param {any} dateValue - Date value (Date, string, number, etc.)
 * @returns {Date|null} Valid Date object or null
 */
export function safeParseDate(dateValue) {
  if (!dateValue) return null;
  
  // Already a Date object
  if (dateValue instanceof Date) {
    return isValid(dateValue) ? dateValue : null;
  }
  
  // String date
  if (typeof dateValue === "string") {
    // Try ISO format first
    const isoDate = parseISO(dateValue);
    if (isValid(isoDate)) return isoDate;
    
    // Try standard Date constructor
    const standardDate = new Date(dateValue);
    return isValid(standardDate) ? standardDate : null;
  }
  
  // Timestamp number
  if (typeof dateValue === "number") {
    const timestampDate = new Date(dateValue);
    return isValid(timestampDate) ? timestampDate : null;
  }
  
  return null;
}