"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationKey: ["login"],
    mutationFn: async (credentials) => {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Échec de la connexion");
      return data;
    },
    onSuccess: (data) => {
      if (!data.data || !data.token) {
        toast.error("Impossible de récupérer l'utilisateur ou le token");
        return;
      }

      // Store token and user consistently
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("cart", JSON.stringify(data.data.cart || []));

      queryClient.setQueryData(["user"], data.data);
      queryClient.setQueryData(["cart"], data.data.cart || []);

      // Notify other components (like Navbar)
      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Connexion réussie !");
      router.push("/"); // redirect after login
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full p-3 rounded-lg bg-neutral-800 border border-gray-700"
          />
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
