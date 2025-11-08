"use client";

import TopVentes from "@/components/TopVentes";
import { useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();

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
    { id: "690a3bbc26ebf05ce130b924", name: "CPU", img: "/cpu.jpg" },
    { id: "690a3bcb26ebf05ce130b927", name: "GPU", img: "/gpu.jpg" },
    { id: "690a3bd126ebf05ce130b92a", name: "Écrans", img: "/screen.jpg" },
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
    <main className="min-h-screen text-zinc-100 bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-950 selection:bg-cyan-400/30 selection:text-white">
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

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed overflow-wrap-wrap-anywhere">
            Trouvez tout l’équipement dont vous avez besoin pour améliorer votre
            setup : ordinateurs, périphériques, accessoires gaming et plus encore.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button className="bg-cyan-400 text-black font-semibold text-lg px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/30 hover:bg-cyan-300 hover:shadow-cyan-500/50 transition duration-300">
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
                onClick={() => router.push(`/products/${item.id}`)}
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

      {/* Pourquoi acheter chez nous */}
      <section className="py-24 px-6 md:px-12 text-centerrelative">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-linear-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Pourquoi acheter chez nous ?
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {benefits.map((text, idx) => (
              <div
                key={idx}
                className="border border-cyan-500/40 bg-zinc-900/80 backdrop-blur-md rounded-xl px-6 py-3 font-medium text-white hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all duration-300"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-0.5 bg-linear-to-r from-cyan-400 via-purple-400 to-fuchsia-400 opacity-80" />
    </main>
  );
};

export default Index;
