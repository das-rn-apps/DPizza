// src/utils/helpers.ts

/**
 * Formats a number as a currency string.
 * @param amount The number to format.
 * @param currency The currency code (e.g., 'USD', 'EUR').
 * @param locale The locale (e.g., 'en-US', 'de-DE').
 * @returns A formatted currency string.
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Capitalizes the first letter of a string.
 * @param str The input string.
 * @returns The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generates a unique ID (simple implementation for frontend use).
 * For a real backend, use UUIDs.
 * @returns A simple unique ID string.
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
