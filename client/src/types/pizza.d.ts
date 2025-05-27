// src/types/pizza.d.ts
// Re-export or extend types from api/types if needed, or define specific UI types here.
// For now, let's keep it simple and just re-export or define common types.
export interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  toppings: string[];
  sizes: string[];
}

export interface PizzaFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}
