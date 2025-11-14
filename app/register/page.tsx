"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  cart?: any[];
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const registerMutation = useMutation<RegisterResponse, Error, { firstName: string; lastName: string; email: string; password: string }>({
    mutationKey: ["register"],
    mutationFn: async (userData) => {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Erreur lors de l'inscription");
      return data;
    },
    onSuccess: (data) => {
      if (!data.data || !data.token) {
        toast.error("Impossible de récupérer l'utilisateur ou le token");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("cart", JSON.stringify(data.data.cart || []));

      queryClient.setQueryData(["user"], data.data);
      queryClient.setQueryData(["cart"], data.data.cart || []);

      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Inscription réussie !");
      // Reload page after a brief delay to ensure localStorage is persisted and Redux store is hydrated
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de l'inscription");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerMutation.mutate({ firstName, lastName, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">Créer un compte</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            required
            className="w-full p-3 rounded-lg bg-neutral-800 border border-gray-700"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom"
            required
            className="w-full p-3 rounded-lg bg-neutral-800 border border-gray-700"
          />
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
            disabled={registerMutation.isPending}
            className="w-full py-3 bg-purple-500 hover:bg-purple-400 rounded-lg font-bold"
          >
            {registerMutation.isPending ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Déjà un compte?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
