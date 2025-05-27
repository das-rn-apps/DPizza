// src/utils/validators.ts

/**
 * Validates if an email address is in a correct format.
 * @param email The email string to validate.
 * @returns True if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  // Regex from https://emailregex.com/
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validates if a password meets certain complexity requirements.
 * Example: at least 8 characters, one uppercase, one lowercase, one number, one special character.
 * @param password The password string to validate.
 * @returns True if the password is valid, false otherwise.
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false; // At least one uppercase letter
  if (!/[a-z]/.test(password)) return false; // At least one lowercase letter
  if (!/[0-9]/.test(password)) return false; // At least one number
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false; // At least one special character
  return true;
};

/**
 * Validates if a string is not empty or just whitespace.
 * @param value The string to validate.
 * @returns True if the string is not empty, false otherwise.
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates if a phone number matches a basic pattern (e.g., 10 digits).
 * This is a very basic example; real-world phone validation is complex.
 * @param phoneNumber The phone number string to validate.
 * @returns True if the phone number is valid, false otherwise.
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Basic regex for 10-digit numbers, optionally with country code or hyphens
  const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
  return phoneRegex.test(phoneNumber);
};
