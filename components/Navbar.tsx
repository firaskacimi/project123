"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "./Menu";

export default function Navbar() {
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  // ✅ Load cart & user from localStorage
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored && stored !== "undefined") setUser(JSON.parse(stored));
        else setUser(null);
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    const loadCart = () => {
      try {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(Array.isArray(items) ? items : []);
      } catch {
        setCart([]);
      }
    };

    loadUser();
    loadCart();

    // ✅ Listen to events from ProductDetails
    const handleUserUpdated = () => loadUser();
    const handleCartUpdated = () => {
      loadCart();
      // Optional: re-render the cart icon
      setShowCart(false);
      setTimeout(() => setShowCart(true), 0);
    };

    // ✅ Listen to localStorage and custom events
    window.addEventListener("userUpdated", handleUserUpdated);
    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", (e) => {
      if (e.key === "cart") loadCart();
      if (e.key === "user") loadUser();
    });

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenu = document.getElementById("user-menu");
      if (userMenu && !userMenu.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowUserMenu(false);
    window.dispatchEvent(new Event("userUpdated"));
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-4 md:px-12 z-50 text-white backdrop-blur-md bg-black/30 border-b border-white/10">
      
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <Link href="/">
          <img className="w-20 h-20" src="/LogoM.png" alt="Logo" />
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-10 text-sm font-medium">
        <Link href="/" className="hover:text-cyan-400 transition">HOME</Link>
        <Link href="/products" className="hover:text-cyan-400 transition">PRODUCTS</Link>
        <Link href="/customized" className="hover:text-cyan-400 transition">CUSTOMIZED</Link>
        <Link href="/about" className="hover:text-cyan-400 transition">ABOUT US</Link>
        <Link href="/contact" className="hover:text-cyan-400 transition">CONTACT US</Link>
        {user?.role === "Admin" && (
          <Link href="/admin" className="hover:text-cyan-400 transition">ADMIN</Link>
        )}
      </nav>

      {/* User + Cart */}
      <div className="hidden md:flex items-center gap-6 relative">
        {/* Auth */}
        {!user ? (
          <Link
            href="/login"
            className="bg-cyan-500/90 px-4 py-1.5 rounded-md hover:bg-cyan-400 transition text-sm font-semibold text-black"
          >
            LOG IN
          </Link>
        ) : (
          <div className="relative" id="user-menu">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}
              className="flex items-center gap-2 font-semibold hover:text-cyan-400 transition"
            >
              {user.firstName || "User"}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-[#0b0e17] border border-cyan-700/50 rounded-xl shadow-lg z-50">
                <Link href="/profile" className="block px-4 py-2 hover:bg-cyan-500/10">Profile</Link>
                <Link href="/cart" className="block px-4 py-2 hover:bg-cyan-500/10">Cart</Link>
                <Link href="/orders" className="block px-4 py-2 hover:bg-cyan-500/10">History</Link>
                {user.role === "Admin" && (
                  <Link href="/admin" className="block px-4 py-2 hover:bg-cyan-500/10">Admin Panel</Link>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* 🛒 Cart Icon */}
        <div
          className="relative cursor-pointer hover:text-cyan-400 transition"
          onClick={() => setShowCart((s) => !s)}
        >
          🛒
          <span className="absolute -top-2 -right-2 bg-cyan-500 text-black text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {cart.length}
          </span>

          {showCart && (
            <div className="absolute right-0 mt-4 w-96 bg-[#0b0e17] border border-cyan-700/60 rounded-2xl shadow-2xl p-5 text-sm backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-700/50 pb-2">
                Votre panier
              </h2>
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Panier vide</p>
              ) : (
                <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item, i) => (
                    <li key={i} className="flex justify-between items-start border-b border-gray-700/40 pb-2">
                      <div className="flex flex-col">
                        <span className="text-gray-200 font-medium truncate w-52">{item.name}</span>
                        <span className="text-gray-400 text-xs">{item.price} €</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/cart"
                className="block text-center mt-5 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Voir le panier complet
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Menu />
      </div>
    </header>
  );
}
