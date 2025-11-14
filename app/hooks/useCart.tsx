"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/state/store";
import { addItem, removeItem, clearCart, loadFromStorage, CartItem } from "@/app/state/cartSlice";

export default function useCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items ?? []);

  useEffect(() => {
    // hydrate from localStorage once
    dispatch(loadFromStorage());
  }, [dispatch]);

  function addToCart(item: CartItem) {
    dispatch(addItem(item));
  }

  function removeFromCartFn(productId: string) {
    dispatch(removeItem(productId));
  }

  function clearCartFn() {
    dispatch(clearCart());
  }

  return {
    cart,
    addToCart,
    removeFromCart: removeFromCartFn,
    clearCart: clearCartFn,
  };
}
