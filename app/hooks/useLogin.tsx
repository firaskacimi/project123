"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, setAuthToken } from "@/app/lib/api";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/app/state/authSlice";

interface LoginData {
  email: string;
  password: string;
}

export function useLogin() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data: any) => {
      // backend returns: { success, message, data: user, token }
      const token = data?.token;
      const user = data?.data;

      if (token) {
        try {
          localStorage.setItem("token", token);
          setAuthToken(token);
        } catch (err) {
          console.error("Failed to persist token:", err);
        }
      }

      if (user) {
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch (err) {
          console.error("Failed to persist user:", err);
        }
      }

      // update redux auth state
      try {
        // useDispatch is available in this hook (client-side). Update slice state.
        if (dispatch) {
          dispatch(setToken(token ?? null));
          dispatch(setUser(user ?? null));
        }
      } catch (err) {
        // fallback already persisted to localStorage
      }

      toast.success("Logged in successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
}
