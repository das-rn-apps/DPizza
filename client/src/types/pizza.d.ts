// src/types/pizza.d.ts
export interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  toppings: string[];
  sizes: string[];
  // You might add more fields like:
  // calories: number;
  // ingredients: string[];
  // isAvailable: boolean;
}

export interface PizzaFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}
