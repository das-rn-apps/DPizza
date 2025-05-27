// src/utils/constants.ts

export const APP_NAME = "Pizza Palace";
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"; // Example API URL
export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_LOCALE = "en-US";

// Navigation links
export const NAV_LINKS = [
  { name: "Menu", path: "/menu" },
  { name: "Cart", path: "/cart" },
  // Add more as needed
];

// Pizza categories (could be fetched from API)
export const PIZZA_CATEGORIES = [
  "All",
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Specialty",
];
