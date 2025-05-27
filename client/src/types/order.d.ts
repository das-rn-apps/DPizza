import type { CartItem } from "./cart";

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
