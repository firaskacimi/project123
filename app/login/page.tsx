"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/app/lib/axios";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  cart?: CartItem[];
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const loginMutation = useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationKey: ["login"],
    mutationFn: async (credentials) => {
      const res = await api.post("/auth/login", credentials);
      const data = res.data;
      if (!data.success) throw new Error(data?.message || "Échec de la connexion");
      return data;
    },
    onSuccess: (data) => {
      if (!data.data || !data.token) {
        toast.error("Impossible de récupérer l'utilisateur ou le token");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      if (Array.isArray(data.data.cart) && data.data.cart.length > 0) {
        localStorage.setItem("cart", JSON.stringify(data.data.cart));
        queryClient.setQueryData(["cart"], data.data.cart);
        window.dispatchEvent(new Event("cartUpdated"));
      }

      try {
        const mod = require("@/app/lib/api");
        if (mod && typeof mod.setAuthToken === "function") mod.setAuthToken(data.token);
      } catch (err) {
        console.warn("Could not set auth token on axios instance:", err);
      }

      queryClient.setQueryData(["user"], data.data);
      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Connexion réussie !");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: (err) => {
      toast.error(err.message || "Échec de la connexion");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4 transition-all duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-md p-8 bg-neutral-900 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">Se connecter</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 rounded-lg bg-neutral-800 border border-gray-700"
          />

          {/* Password Field with Show/Hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="w-full p-3 rounded-lg bg-neutral-800 border border-gray-700 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? "❌" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-bold"
          >
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Pas encore de compte?{" "}
          <Link href="/register" className="text-purple-400 hover:text-purple-300">
            Créez-en un
          </Link>
        </p>
      </div>
    </div>
  );
}
