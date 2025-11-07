"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RegisterResponse {
  token: string;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export default function RegisterPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => setFadeIn(true), []);

  const registerMutation = useMutation<
    RegisterResponse,
    Error,
    { firstName: string; lastName: string; email: string; password: string }
  >({
    mutationKey: ["register"],
    mutationFn: async (userData) => {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || "Erreur lors de l'inscription";
        throw new Error(msg);
      }
      return data as RegisterResponse;
    },

    onSuccess: (data) => {
      console.log("Registration response:", data);

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      if (data?.data && typeof data.data === "object") {
        const userString = JSON.stringify(data.data);
        localStorage.setItem("user", userString);
      }

      queryClient.setQueryData(["user"], data.data);

      // Notify navbar of the update
      window.dispatchEvent(new Event("userUpdated"));

      // Redirect after short delay
      setTimeout(() => router.push("/"), 300);
    },

    onError: (err) => {
      console.error("Registration failed:", err);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    registerMutation.mutate({ firstName, lastName, email, password });
  }

  return (
    <div
      className={`min-h-screen flex bg-neutral-950 text-white overflow-hidden transition-all duration-700 ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* LEFT SIDE: Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-neutral-900/80 border border-gray-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            Créer un compte
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-400">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Entrez votre prénom"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-400">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Entrez votre nom"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-400">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choisissez un mot de passe"
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500 outline-none transition"
              />
            </div>

            {registerMutation.isError && (
              <p className="text-red-500 text-sm text-center">
                {(registerMutation.error as Error)?.message}
              </p>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className={`w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 rounded-lg shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300 ${
                registerMutation.isPending ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {registerMutation.isPending ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-500 hover:scale-[1.03]"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/30 via-fuchsia-400/20 to-cyan-400/20 animate-linear-shift bg-size-[200%_200%]" />
        <div className="relative z-10 text-center max-w-md px-6">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            Rejoignez-nous
          </h1>
          <p className="text-gray-300 text-lg">
            Créez votre compte et commencez à explorer notre univers PC & gaming
            dès aujourd’hui.
          </p>
        </div>
      </div>
    </div>
  );
}
