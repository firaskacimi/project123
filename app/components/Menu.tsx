"use client";

import Link from "next/link";
import { useState } from "react";

function Menu() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <img
        src="./menu.png"
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-black text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-2xl">
          {" "}
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/products">Products</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/cart">Cart</Link>
        </div>
      )}
    </div>
  );
}

export default Menu;
