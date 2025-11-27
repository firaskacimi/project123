"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopVentes from "./components/TopVentes";
import MyPCSummary from "./components/MyPCSummary";
import { api } from "./lib/api"; // Adjust path if needed
import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  image?: string;
};

const fetchCategories = async (): Promise<Category[]> => {
  const res = await api.get("/category");
  if (!res.data.success) throw new Error(res.data.message || "Failed to fetch categories");
  return res.data.data;
};

const Index = () => {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with your auth check
    setIsLoggedIn(!!token);
  }, []);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });


  // Fetch all products from backend
  const fetchAllProducts = async () => {
    const res = await api.get("/products?limit=100");
    if (!res.data.success) throw new Error(res.data.message || "Failed to fetch products");
    return res.data.data;
  };

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
  });

  // Select one product from each of the first 4 categories
  const topCategoryProducts = (categoriesLoading || productsLoading)
    ? []
    : categories.slice(0, 4).map((cat) =>
        allProducts.find((prod: any) => prod.category?._id === cat._id)
      ).filter(Boolean);

  return (
    <main
      className={`min-h-screen text-zinc-100 selection:text-white transition-all duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] sm:h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 sm:px-6 md:px-12">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dgwcqsnn6/image/upload/v1764020268/Configuration_futuriste_en_bleu_n%C3%A9on_ux12kt.png')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/90 backdrop-saturate-150" />
        <div className="relative z-10 max-w-3xl sm:max-w-4xl space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance">
            Boostez vos performances avec le meilleur{" "}
            <span className="bg-linear-to-r from-cyan-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent animate-[linearShift_4s_ease-in-out_infinite]">
              du matériel informatique
            </span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Trouvez tout l’équipement dont vous avez besoin pour améliorer votre setup :
            ordinateurs, périphériques, accessoires gaming et plus encore.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-10">
            <button
              onClick={() => router.push("/products")}
              className="bg-cyan-400 text-black font-semibold text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg shadow-cyan-500/30 hover:bg-cyan-300 hover:shadow-cyan-500/50 transition duration-300"
            >
              SHOP NOW
            </button>

            {!isLoggedIn && (
              <Link
                href="/login"
                className="border border-purple-400 text-purple-400 hover:bg-purple-600/80 hover:text-white font-semibold text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg shadow-purple-500/20 transition duration-300"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Top Ventes */}
      {(categoriesLoading || productsLoading) ? (
        <div className="text-center text-gray-400 py-12">Chargement des produits...</div>
      ) : (
        <TopVentes products={topCategoryProducts} limit={4} />
      )}

      {/* Categories */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 md:px-12 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-cyan-500/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-purple-500/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 bg-linear-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Catégories de produits
          </h2>

          {categoriesLoading ? (
            <p className="text-gray-400 text-sm sm:text-base">Chargement des catégories...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {categories.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("category", item._id);
                    params.set("page", "1");
                    router.push(`/products?${params.toString()}`);
                  }}
                  className="group relative cursor-pointer rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 hover:border-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image || "/default-category.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2 sm:p-3">
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-purple-400 group-hover:text-fuchsia-400 transition-colors duration-300">
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom PC Showcase */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-12 bg-gray relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Customize Your Own PC
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Build the ultimate gaming machine tailored to your needs. Pick the components,
              optimize performance, and create a PC that’s truly yours.
            </p>

            <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
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
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-cyan-400 via-purple-500 to-fuchsia-500 text-black font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300"
            >
              Customize Now
            </button>
          </div>

          <div className="flex-1 relative w-full max-w-lg sm:max-w-xl lg:max-w-none">
            <div className="rounded-2xl overflow-hidden group-hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] transition-all duration-500">
              <img
                src="/hero-gaming.png"
                alt="Custom Gaming PC"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-4 left-4 bg-gray-800/70 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-3 sm:p-4 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
              <h3 className="text-lg sm:text-xl font-bold text-cyan-400">BOLT</h3>
              <p className="text-green-400 text-xs sm:text-sm font-medium">Optimal Performance</p>

              <ul className="mt-1 sm:mt-2 text-gray-300 text-xs sm:text-sm space-y-1">
                <li>Premium Custom PC</li>
                <li>Ready for High-Performance</li>
                <li>Premium Full Steel Chassis</li>
              </ul>

              <div className="mt-2 sm:mt-3 flex items-center justify-between">
                <span className="text-white font-bold text-sm sm:text-base">$2550</span>
                <button
                  onClick={() => router.push("/customized")}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-cyan-400 text-black rounded-md sm:rounded-lg font-medium hover:bg-cyan-300 transition"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

   {/* About Us Section */}
<section className="py-16 px-4 sm:px-6 md:px-12 text-center">
  <div className="max-w-4xl mx-auto space-y-6">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-cyan-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
      About Us
    </h2>
    <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
      We are a team of tech enthusiasts dedicated to providing high-quality hardware and custom PC solutions.
      Our mission is to help gamers and creators achieve the ultimate setup with performance, style, and reliability.
    </p>
    <Link
      href="/about"
      className="inline-block mt-4 px-6 py-3 bg-cyan-400 text-black font-semibold rounded-xl shadow-lg hover:bg-cyan-300 transition duration-300"
    >
      Learn More
    </Link>
  </div>
</section>
{/* Why Us Section */}
<section className="py-16 px-4 sm:px-6 md:px-12">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
    {/* Left Image */}
    <div className="flex-1 flex justify-center lg:justify-start">
      <img
        src="https://res.cloudinary.com/dgwcqsnn6/image/upload/v1764019965/020f458122d9f7a3cd5d0eba923d6962-confused-gamer-cartoon_vmqvey.webp" 
        alt="Why Us Illustration"
        className="w-48 sm:w-64 lg:w-72 object-contain"
      />
    </div>

    {/* Right Text: only H2 and P */}
    <div className="flex-1 space-y-6 text-left">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-cyan-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
        Why Choose Us
      </h2>
      <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
        We provide top-quality hardware, custom PC solutions, and personalized support to help you achieve your ultimate gaming setup. 
        Our products combine performance, reliability, and style, making us the trusted choice for gamers and creators alike.
      </p>
    </div>
  </div>

  {/* Cards below, full width */}
  <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <div className="bg-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
      <h3 className="text-xl font-semibold text-cyan-400 mb-2">High Performance</h3>
      <p className="text-gray-300 text-sm sm:text-base">
        Our components are carefully selected for peak performance in gaming and productivity.
      </p>
    </div>
    <div className="bg-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
      <h3 className="text-xl font-semibold text-purple-400 mb-2">Custom Solutions</h3>
      <p className="text-gray-300 text-sm sm:text-base">
        Build your dream PC with our custom solutions tailored to your needs and style.
      </p>
    </div>
    <div className="bg-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
      <h3 className="text-xl font-semibold text-fuchsia-400 mb-2">Trusted Support</h3>
      <p className="text-gray-300 text-sm sm:text-base">
        Our team is here to help you anytime, ensuring a smooth and satisfying experience.
      </p>
    </div>
  </div>
</section>



{/* Contact Us Section */}
<section className="py-16 px-4 sm:px-6 md:px-12 text-left">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
    {/* Text */}
    <div className="flex-1 space-y-6">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
        Contact Us
      </h2>
      <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
        Have questions or need support? Get in touch with us anytime. We’re here to help you create your perfect gaming setup.
      </p>
      <Link
        href="/contact"
        className="inline-block mt-4 px-6 py-3 bg-purple-500 text-black font-semibold rounded-xl shadow-lg hover:bg-purple-400 transition duration-300"
      >
       Contact Us
      </Link>
    </div>

    {/* Image */}
    <div className="flex-1">
      <img
        src="https://res.cloudinary.com/dgwcqsnn6/image/upload/v1764019907/Mention-bro_fmn8bq.svg"
        alt="Contact Us"
        className="w-full h-full object-cover rounded-3xl shadow-lg"
      />
    </div>
  </div>
</section>
    </main>
  );
};

export default Index;
