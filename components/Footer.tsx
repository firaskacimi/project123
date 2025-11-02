"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b0e17] text-gray-300 border-t border-blue-900 mt-0">
      {/* linear line to match your theme */}
      <div className="h-[2px] bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">PcShop</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Votre boutique de confiance pour des produits performants et de
            qualité à des prix compétitifs.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-cyan-400 transition">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition">
                Produits
              </Link>
            </li>
            <li>
              <Link href="/customized" className="hover:text-cyan-400 transition">
                Personnalisé
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cyan-400 transition">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cyan-400 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm text-gray-400">
            Email :{" "}
            <a
              href="mailto:support@pcshop.com"
              className="hover:text-cyan-400 transition"
            >
              support@pcshop.com
            </a>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Téléphone :{" "}
            <a
              href="tel:+213555000000"
              className="hover:text-cyan-400 transition"
            >
              +213 555 000 000
            </a>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Adresse : Alger, Algérie
          </p>
        </div>
      </div>

      <div className="border-t border-blue-900 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} PcShop — Tous droits réservés.
      </div>
    </footer>
  );
}
