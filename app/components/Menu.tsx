"use client";

import Link from "next/link";
import { useState } from "react";

function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50">
      {/* Hamburger Icon */}
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00IDE4cS0uNDI1IDAtLjcxMi0uMjg4VDMgMTd0LjI4OC0uNzEyVDQgMTZoMTZxLjQyNSAwIC43MTMuMjg4VDIxIDE3dC0uMjg4LjcxM1QyMCAxOHptMC01cS0uNDI1IDAtLjcxMi0uMjg4VDMgMTJ0LjI4OC0uNzEyVDQgMTFoMTZxLjQyNSAwIC43MTMuMjg4VDIxIDEydC0uMjg4LjcxM1QyMCAxM3ptMC01cS0uNDI1IDAtLjcxMi0uMjg4VDMgN3QuMjg4LS43MTJUNCA2aDE2cS40MjUgMCAuNzEzLjI4OFQyMSA3dC0uMjg4LjcxM1QyMCA4eiIvPjwvc3ZnPg=="
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
        alt="menu"
      />

      {/* Menu Overlay */}
      <div
        className={`absolute -left-100 top-13  h-screen w-l p-50 flex flex-col items-center justify-center gap-8 text-2xl bg-black text-white transition-all duration-300 ${
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
