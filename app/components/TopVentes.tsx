import { useMemo } from "react";
import ProductCard from "./ProductCrad";

type ProductType = {
  _id: string;
  name: string;
  image?: string;
};

type TopVentesProps = {
  products: ProductType[];
  limit?: number;
};

function TopVentes({ products, limit = 4 }: TopVentesProps) {
  // Always show the first 4 products, never randomize
  const fixedProducts = useMemo(() => products.slice(0, limit), [products, limit]);

  return (
    <section className="py-24 px-4 md:px-16 relative">
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Top ventes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fixedProducts.map((item) => (
            <ProductCard
              key={item._id}
              _id={item._id}
              name={item.name}
              price={(item as any).price || 0}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopVentes;
