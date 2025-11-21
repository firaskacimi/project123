"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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
      const existing = state.items.find((i) => i._id === action.payload._id);
      if (existing) {
        existing.quantity += action.payload.quantity;
        if (existing.quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== existing._id);
        }
      } else {
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
      state.items = state.items.filter((i) => i._id !== action.payload);
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
