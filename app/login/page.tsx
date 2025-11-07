"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LoginResponse {
  token: string;
  user: { name: string; email: string } | null;
}

export default function LoginPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => setFadeIn(true), []);

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationKey: ['login'],
    mutationFn: async (credentials) => {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) {
        // Try to use server message if present
        const msg = data?.message || "Identifiants invalides";
        throw new Error(msg);
      }
      return data as LoginResponse;
    },
    onSuccess: (data) => {
      try {
        console.log("Login response:", data); // Debug log

        if (data?.token) {
          localStorage.setItem("token", data.token);
          console.log("Token saved successfully"); // Debug log
        } else {
          console.warn("Login response has no token:", data);
        }

        // IMPORTANT: stringify the user ALWAYS (guard against undefined)
        if (data?.user && typeof data.user === "object") {
          const userString = JSON.stringify(data.user);
          localStorage.setItem("user", userString);
          console.log("User saved to localStorage:", userString); // Debug log
        } else {
          // if the backend doesn't return user, remove any leftover
          localStorage.removeItem("user");
          console.warn("Login response contains no user object:", data);
        }

        // set react-query cache (optional)
        if (data.user) {
          queryClient.setQueryData(["user"], data.user);
          console.log("User cache updated"); // Debug log
        }

        // Create and dispatch the event
        const event = new Event("userUpdated");
        window.dispatchEvent(event);
        console.log("userUpdated event dispatched"); // Debug log

        // Small delay before redirect to ensure events are processed
        setTimeout(() => {
          router.push("/");
        }, 100);
      } catch (err) {
        console.error("onSuccess error:", err);
      }
    },
    onError: (err) => {
      console.error("Login failed:", err);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <div className={`min-h-screen flex bg-neutral-950 text-white overflow-hidden transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/30 via-purple-500/20 to-fuchsia-500/20 animate-linear-shift bg-size[200%_200%]" />
        <div className="relative z-10 text-center max-w-md px-6">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Bienvenue</h1>
          <p className="text-gray-300 text-lg">Connectez-vous pour retrouver vos produits, vos commandes et vos préférences gaming.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-neutral-900/80 border border-gray-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,217,255,0.1)] backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Se connecter</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-400">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Entrez votre email" className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition" />
            </div>

            <div>
              <label className="block mb-2 text-gray-400">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entrez votre mot de passe" className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition" />
            </div>

            {loginMutation.isError && <p className="text-red-500 text-sm text-center">{(loginMutation.error as Error)?.message}</p>}

            <button type="submit" disabled={loginMutation.isPending} className={`w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all duration-300 ${loginMutation.isPending ? "opacity-70 cursor-not-allowed" : ""}`}>
              {loginMutation.isPending ? "Connexion..." : "Connexion"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">Pas encore de compte ? <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-all duration-500 hover:scale-[1.03]">Créez-en un</Link></p>
        </div>
      </div>
    </div>
  );
}
