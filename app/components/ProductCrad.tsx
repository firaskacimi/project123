"use client";

import Link from "next/link";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export default function ProductCard({ _id, name, price, image }: ProductCardProps) {
  return (
    <Link
      href={`/products/${_id}`}
      className="bg-[#111827] rounded-xl p-4 border border-cyan-700/40 shadow-md
                 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300"
    >
      <div className="w-full aspect-square overflow-hidden rounded-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-purple-400">{name}</h3>
      <p className="text-cyan-400 font-bold text-xl">{price} €</p>
    </Link>
  );
}
