"use client";

interface ProductDetailsCardProps {
  name: string;
  description?: string;
  details?: string;
  price: number;
  stockQuantity: number;
  image?: string;
  onAddToCart: () => void;
  added: boolean;
}

export default function ProductDetailsCard({
  name,
  description,
  details,
  price,
  stockQuantity,
  image,
  onAddToCart,
  added
}: ProductDetailsCardProps) {
  return (
    <div className="max-w-5xl mx-auto bg-[#111827] rounded-2xl shadow-lg border border-cyan-800 p-8 flex flex-col md:flex-row gap-8">
      
      {/* Left Image */}
      {image && (
        <div className="shrink-0 w-full md:w-1/3">
          <img
            src={image}
            alt={name}
            className="w-full h-auto rounded-xl object-cover shadow-lg"
          />
        </div>
      )}

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-cyan-400">{name}</h1>
          <p className="text-gray-300 mb-4">
            {description || "Aucune description disponible."}
          </p>

          {details && (
            <div className="bg-[#0f172a] border border-cyan-900/40 rounded-xl p-5 mb-6">
              <h2 className="text-xl font-semibold text-purple-400 mb-2">
                Détails du produit
              </h2>
              <p className="text-gray-300 leading-relaxed">{details}</p>
            </div>
          )}
        </div>

        {/* Price / Stock / Cart */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <span className="text-2xl font-bold text-purple-400">
            {price} €
          </span>

          <span
            className={`text-sm px-3 py-1 rounded-full ${
              stockQuantity > 0
                ? "bg-green-600/30 text-green-400"
                : "bg-red-600/30 text-red-400"
            }`}
          >
            {stockQuantity > 0 ? "En stock" : "Rupture de stock"}
          </span>

          <button
            onClick={onAddToCart}
            disabled={stockQuantity <= 0}
            className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              stockQuantity > 0
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-600 cursor-not-allowed text-gray-400"
            }`}
          >
            {added ? "✅ Ajouté !" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  );
}
