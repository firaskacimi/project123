"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function RegisterPage() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div
      className={`min-h-screen flex bg-neutral-950 text-white overflow-hidden transition-all duration-700 ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        background:
          "linear-linear(180deg, #050505 0%, #0a0a0a 40%, #111111 100%)",
      }}
    >
      {/* LEFT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-neutral-900/80 border border-gray-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            Créer un compte
          </h1>

          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-400">Nom complet</label>
              <input
                type="text"
                placeholder="Entrez votre nom"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-400">Email</label>
              <input
                type="email"
                placeholder="Entrez votre email"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-400">Mot de passe</label>
              <input
                type="password"
                placeholder="Choisissez un mot de passe"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 rounded-lg shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300"
            >
              S'inscrire
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
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/30 via-fuchsia-400/20 to-cyan-400/20 animate-linear-shift bg-[length:200%_200%]" />
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
