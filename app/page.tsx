"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TopVentes from "./components/TopVentes";
import MyPCSummary from "./components/MyPCSummary";

const Index = () => {
  const router = useRouter();

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);


  const topProducts = [
    { name: "Clavier RGB", img: "/keyboard.jpg" },
    { name: "Souris gaming", img: "/mouse.jpg" },
    { name: "Accessoires PC", img: "/accessories.jpg" },
    { name: "Chargeur portable", img: "/charger.jpg" },
  ];

  const categories = [
    { id: "690a3b9e26ebf05ce130b91b", name: "Ordinateurs Complets", img: "/gaming-pc.jpg" },
    { id: "690a3bab26ebf05ce130b91e", name: "Souris", img: "/mouse.jpg" },
    { id: "690a3bb426ebf05ce130b921", name: "Claviers", img: "/keyboard.jpg" },
    { id: "690a3bbc26ebf05ce130b924", name: "CPU", img: "/processor.png" },
    { id: "690a3bcb26ebf05ce130b927", name: "GPU", img: "/graphics-card.png" },
    { id: "690a3bd126ebf05ce130b92a", name: "Écrans", img: "/Monitor.png" },
     { id: "storage", name: "Stockage", img: "/storage.png" },
  { id: "power-supply", name: "Alimentation", img: "/power-supply.png" },
  { id: "pc-case", name: "Boîtier PC", img: "/pc-case.png" },
  { id: "motherboard", name: "Carte Mère", img: "/motherboard.png" },
  { id: "memory", name: "Mémoire RAM", img: "/memory.png" },
  { id: "cooling", name: "Refroidissement", img: "/cooling.png" },
  ];

  const benefits = [
    "Qualité garantie",
    "Prix compétitifs",
    "Large choix",
    "Service client réactif",
    "Livraison rapide et sécurisée",
    "Garantie & support",
  ];

  return (
    <main  className={`min-h-screen text-zinc-100 bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-950 selection:bg-cyan-400/30 selection:text-white transition-all duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('/hero-gaming.png')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/90 backdrop-saturate-150" />

        <div className="relative z-10 max-w-4xl px-4 space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-balance">
            Boostez vos performances avec le meilleur{" "}
            <span className="bg-linear-to-r from-cyan-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent animate-[linearShift_4s_ease-in-out_infinite]">
              du matériel informatique
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Trouvez tout l’équipement dont vous avez besoin pour améliorer votre
            setup : ordinateurs, périphériques, accessoires gaming et plus encore.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={() => router.push("/products")}
              className="bg-cyan-400 text-black font-semibold text-lg px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/30 hover:bg-cyan-300 hover:shadow-cyan-500/50 transition duration-300"
            >
              SHOP NOW
            </button>
            <button className="border border-purple-400 text-purple-400 hover:bg-purple-600/80 hover:text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg shadow-purple-500/20 transition duration-300">
              Se connecter
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse" />
      </section>

      {/* Top Ventes */}
      <TopVentes />

      {/* Categories */}
      <section className="relative py-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-linear-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Catégories de produits
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/products?category=${item.id}`)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900 hover:border-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xl font-semibold text-purple-400 group-hover:text-fuchsia-400 transition-colors duration-300">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* Custom PC Showcase */}
<section className="py-20 px-6 md:px-12 bg-gray relative">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
    {/* Left content */}
    <div className="flex-1 space-y-6">
      <h2 className="text-4xl md:text-5xl font-bold text-white">
        Customize Your Own PC
      </h2>
      <p className="text-gray-400 text-lg md:text-xl">
        Build the ultimate gaming machine tailored to your needs. Pick the components,
        optimize performance, and create a PC that’s truly yours.
      </p>

      <ul className="space-y-3 text-gray-300">
        <li className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">✔</span> Premium Custom PC
        </li>
        <li className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">✔</span> High-Performance Components
        </li>
        <li className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">✔</span> Full Steel Chassis
        </li>
      </ul>

      <button
        onClick={() => router.push("/customized")}
        className="mt-6 px-6 py-3 bg-linear-to-r from-cyan-400 via-purple-500 to-fuchsia-500 text-black font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-300"
      >
        Customize Now
      </button>
    </div>

    {/* Right image card */}
    <div className="flex-1 relative group">
      <div className="rounded-3xl overflow-hidden group-hover:shadow-[0_0_80px_rgba(168,85,247,0.5)] transition-all duration-500">
        <img
          src="/hero-gaming.png" 
          alt="Custom Gaming PC"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Neon info overlay */}
      <div className="absolute bottom-4 left-4 bg-gray-800/70 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        <h3 className="text-xl font-bold text-cyan-400">BOLT</h3>
        <p className="text-green-400 text-sm font-medium">Optimal Performance</p>

        <ul className="mt-2 text-gray-300 text-sm space-y-1">
          <li>Premium Custom PC</li>
          <li>Ready for High-Performance</li>
          <li>Premium Full Steel Chassis</li>
        </ul>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-white font-bold text-lg">$2550</span>
          <button
            onClick={() => router.push("/customized")}
            className="px-4 py-1 bg-cyan-400 text-black rounded-lg font-medium hover:bg-cyan-300 transition"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  </div>
</section>



      <div className="h-0.5 bg-linear-to-r from-cyan-400 via-purple-400 to-fuchsia-400 opacity-80" />
    </main>
  );
};

export default Index;
