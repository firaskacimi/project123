"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: string;
  name?: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
        if (existing.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== existing.productId);
        }
      } else {
        // if payload.quantity can be negative, guard
        if (action.payload.quantity > 0) state.items.push(action.payload);
      }
      // persist
      try {
        localStorage.setItem("cart", JSON.stringify(state.items));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        // ignore
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      try {
        localStorage.setItem("cart", JSON.stringify(state.items));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {}
    },
    clearCart(state) {
      state.items = [];
      try {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {}
    },
    loadFromStorage(state) {
      try {
        const raw = localStorage.getItem("cart");
        state.items = raw ? JSON.parse(raw) : [];
      } catch (err) {
        state.items = [];
      }
    },
  },
});

export const { setCart, addItem, removeItem, clearCart, loadFromStorage } = slice.actions;
export default slice.reducer;
