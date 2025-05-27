// src/store/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (cartItem) =>
              cartItem.pizzaId === item.pizzaId &&
              cartItem.selectedSize === item.selectedSize
          );

          let updatedItems;
          if (existingItemIndex > -1) {
            updatedItems = state.items.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            );
          } else {
            updatedItems = [...state.items, item];
          }

          // Calculate totals based on updatedItems
          const totalItems = updatedItems.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          );
          const totalPrice = updatedItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
          );

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== itemId);

          // Recalculate totals
          const totalItems = updatedItems.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          );
          const totalPrice = updatedItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
          );

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      updateItemQuantity: (itemId, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          );

          // Recalculate totals
          const totalItems = updatedItems.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          );
          const totalPrice = updatedItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
          );

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      // Optional if you want to calculate totals on demand
      calculateTotals: () => {
        const items = get().items;
        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        set({ totalItems, totalPrice });
      },
    }),
    {
      name: "pizza-cart-storage", // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
