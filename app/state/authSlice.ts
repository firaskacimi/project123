"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = any;

type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      try {
        if (action.payload) localStorage.setItem("token", action.payload);
        else localStorage.removeItem("token");
      } catch (err) {}
    },
    loadFromStorage(state) {
      try {
        const u = localStorage.getItem("user");
        state.user = u ? JSON.parse(u) : null;
        state.token = localStorage.getItem("token");
      } catch (err) {
        state.user = null;
        state.token = null;
      }
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch (err) {}
    },
  },
});

export const { setUser, setToken, loadFromStorage, clearAuth } = slice.actions;
export default slice.reducer;
