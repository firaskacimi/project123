"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) => {
        const existing = get().cart.find((i) => i._id === item._id);
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((i) => i._id !== id) });
      },

      clearCart: () => set({ cart: [] }),

      setCart: (items) => set({ cart: items }),

      getTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" } // saves to localStorage
  )
);
