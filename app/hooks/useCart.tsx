"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const queryClient = useQueryClient();

  // Load cart on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Listen to login/logout events
  useEffect(() => {
    const handleUserUpdated = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCart(JSON.parse(savedCart));
      else setCart([]);
    };

    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, []);

  // Save cart to localStorage & React Query whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    queryClient.setQueryData(["cart"], cart);
  }, [cart, queryClient]);

  function addToCart(item: CartItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, item];
    });
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("cart");
  }

  return { cart, addToCart, removeFromCart, clearCart };
}
