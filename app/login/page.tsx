"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

interface User {
  name: string;
  email: string;
  cart: CartItem[];
}

interface LoginResponse {
  token: string;
  user: User | null;
  message?: string;
}

export default function LoginPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => setFadeIn(true), []);

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
      if (!data.user || !data.token) {
        toast.error("Impossible de récupérer l'utilisateur ou le token");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("cart", JSON.stringify(data.user.cart || []));
      queryClient.setQueryData(["user"], data.user);
      queryClient.setQueryData(["cart"], data.user.cart || []);
      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Connexion réussie !");
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message || "Échec de la connexion");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <div className={`min-h-screen flex bg-neutral-950 text-white overflow-hidden transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-neutral-900/80 border border-gray-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,217,255,0.1)] backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Se connecter
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition duration-300"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-400">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={`w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all duration-300 ${
                loginMutation.isPending ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loginMutation.isPending ? "Connexion..." : "Connexion"}
            </button>

            {loginMutation.isError && (
              <p className="text-red-500 text-sm text-center mt-2">{(loginMutation.error as Error)?.message}</p>
            )}
          </form>

          <p className="mt-6 text-center text-gray-400">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-purple-400 hover:text-purple-300 font-medium transition-all duration-500 hover:scale-[1.03]"
            >
              Créez-en un
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
