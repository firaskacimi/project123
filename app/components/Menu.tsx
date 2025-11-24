"use client";

import Link from "next/link";
import { useState } from "react";

function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50">
      {/* Hamburger Icon */}
      <img
        src="./menu.png"
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
        alt="menu"
      />

      {/* Menu Overlay */}
      <div
        className={`absolute left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-2xl bg-black text-white transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <Link href="/" onClick={() => setOpen(false)}>Home</Link>
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        <Link href="/products" onClick={() => setOpen(false)}>Products</Link>
        <Link href="/profile" onClick={() => setOpen(false)}>Profile</Link>
        <Link href="/cart" onClick={() => setOpen(false)}>Cart</Link>
      </div>
    </div>
  );
}

export default Menu;
