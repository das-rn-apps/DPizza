// src/types/cart.d.ts
// Re-export or extend types from api/types if needed.
export interface CartItem {
  id: string; // Unique ID for the cart item itself
  pizzaId: string; // ID of the pizza
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize: string;
  // Add other properties relevant to a cart item, e.g., custom toppings
  // customToppings?: string[];
}
