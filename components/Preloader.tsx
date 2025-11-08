// components/Preloader.tsx
"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
      {/* Logo */}
      <img
        src="/LogoM.png"
        alt="Logo"
        className="w-24 h-24 mb-6 animate-bounce"
      />

      {/* Spinning Gradient Rings */}
      <div className="relative w-32 h-32">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-cyan-400 border-r-purple-500 border-b-fuchsia-500 border-l-purple-400 rounded-full animate-spin-slow" />
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-500 border-r-cyan-400 border-b-purple-400 border-l-fuchsia-500 rounded-full animate-spin-slower" />
      </div>

      {/* Loading Text */}
      <p className="text-white mt-6 text-lg font-semibold animate-pulse">
        Chargement du site...
      </p>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className={`absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70 animate-float-${i % 3}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
