// src/store/orderStore.ts
import { create } from "zustand";
import { fetchOrdersByUserId, fetchOrderById } from "../api/fakeApi";
import type { Order } from "../api/types";

interface OrderState {
  userOrders: Order[];
  currentOrder: Order | null;
  loadingOrders: boolean;
  loadingCurrentOrder: boolean;
  errorOrders: string | null;
  errorCurrentOrder: string | null;
  fetchUserOrders: (userId: string) => Promise<void>;
  fetchOrderDetails: (orderId: string, userId?: string | null) => Promise<void>;
  clearCurrentOrder: () => void;
  clearUserOrders: () => void; // Added for logout scenarios
}

export const useOrderStore = create<OrderState>((set) => ({
  userOrders: [],
  currentOrder: null,
  loadingOrders: false,
  loadingCurrentOrder: false,
  errorOrders: null,
  errorCurrentOrder: null,

  fetchUserOrders: async (userId: string) => {
    set({ loadingOrders: true, errorOrders: null });
    try {
      const orders = await fetchOrdersByUserId(userId);
      set({ userOrders: orders, loadingOrders: false });
    } catch (err: any) {
      set({
        errorOrders: err.message || "Failed to fetch user orders.",
        loadingOrders: false,
      });
      console.error("Error fetching user orders:", err);
    }
  },

  fetchOrderDetails: async (orderId: string, userId?: string | null) => {
    set({
      loadingCurrentOrder: true,
      errorCurrentOrder: null,
      currentOrder: null,
    });
    try {
      const order = await fetchOrderById(orderId, userId);
      if (order) {
        set({ currentOrder: order, loadingCurrentOrder: false });
      } else {
        set({
          errorCurrentOrder:
            "Order not found or you do not have permission to view it.",
          loadingCurrentOrder: false,
        });
      }
    } catch (err: any) {
      set({
        errorCurrentOrder: err.message || "Failed to fetch order details.",
        loadingCurrentOrder: false,
      });
      console.error("Error fetching single order:", err);
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null, errorCurrentOrder: null }),
  clearUserOrders: () => set({ userOrders: [], errorOrders: null }),
}));
