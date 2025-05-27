// src/store/pizzaStore.ts
import { create } from "zustand";
import { fetchPizzas } from "../api/fakeApi";
import type { Pizza, PizzaFilterOptions } from "../types/pizza";

interface PizzaState {
  pizzas: Pizza[];
  loading: boolean;
  error: string | null;
  filters: PizzaFilterOptions;
  fetchPizzas: (query?: string) => Promise<void>;
  setFilters: (filters: PizzaFilterOptions) => void;
}

export const usePizzaStore = create<PizzaState>((set) => ({
  pizzas: [],
  loading: false,
  error: null,
  filters: {}, // Initial empty filters

  fetchPizzas: async (query?: string) => {
    set({ loading: true, error: null });
    try {
      const fetchedPizzas = await fetchPizzas(query);
      set({ pizzas: fetchedPizzas, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch pizzas.", loading: false });
      console.error(err);
    }
  },

  setFilters: (newFilters: PizzaFilterOptions) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    // You might want to re-fetch pizzas here based on the new filters
    // A debounce would be good if filters change rapidly (e.g., search input)
  },
}));
