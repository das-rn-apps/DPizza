// src/hooks/usePizzaFilter.ts
import { useState, useMemo } from "react";
import type { Pizza, PizzaFilterOptions } from "../types/pizza";
import { useDebounce } from "./useDebounce";

/**
 * A custom hook for filtering a list of pizzas based on various criteria.
 *
 * @param initialPizzas The initial list of pizzas to filter.
 * @returns An object containing filtered pizzas, current filters, and functions to set filters.
 */
export const usePizzaFilter = (initialPizzas: Pizza[]) => {
  const [filters, setFilters] = useState<PizzaFilterOptions>({
    category: "All",
    searchQuery: "",
    minPrice: undefined,
    maxPrice: undefined,
  });

  // Debounce search query to prevent excessive re-renders/filtering on every keystroke
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

  const filteredPizzas = useMemo(() => {
    let currentPizzas = initialPizzas;

    // Filter by search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      currentPizzas = currentPizzas.filter(
        (pizza) =>
          pizza.name.toLowerCase().includes(query) ||
          pizza.description.toLowerCase().includes(query) ||
          pizza.toppings.some((topping) =>
            topping.toLowerCase().includes(query)
          )
      );
    }

    // Filter by category
    if (filters.category && filters.category !== "All") {
      currentPizzas = currentPizzas.filter(
        (pizza) => pizza.category === filters.category
      );
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      currentPizzas = currentPizzas.filter(
        (pizza) => pizza.price >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined) {
      currentPizzas = currentPizzas.filter(
        (pizza) => pizza.price <= filters.maxPrice!
      );
    }

    return currentPizzas;
  }, [initialPizzas, filters, debouncedSearchQuery]);

  return { filteredPizzas, filters, setFilters };
};
