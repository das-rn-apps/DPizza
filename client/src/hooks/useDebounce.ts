// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

/**
 * A custom hook that debounces a value.
 * Useful for delaying state updates or expensive operations until a certain time has passed
 * since the last change, e.g., for search input.
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes (or component unmounts)
    // This ensures that the timer is reset every time the value changes,
    // so the callback only fires after `delay` milliseconds of inactivity.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run if value or delay changes

  return debouncedValue;
}
