// src/api/types.ts

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

export interface CartItem {
  id: string; // This could be pizza.id or a unique ID for the cart item
  pizzaId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize: string;
  // Any custom additions (e.g., extra toppings added by user)
  // customToppings?: string[];
}

export interface Order {
  id: string;
  userId: string | null; // Null if guest checkout
  items: CartItem[];
  totalAmount: number;
  status:
    | "Pending"
    | "Confirmed"
    | "Preparing"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  orderDate: string; // ISO string
  // You might add delivery address, payment info, etc.
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent from backend, but included for fake API
  token?: string; // JWT token
}

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
};
