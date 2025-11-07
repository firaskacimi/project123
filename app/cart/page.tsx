"use client";

import useCart from "../hooks/useCart";



export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  if (!cart || cart.length === 0)
    return <p className="text-gray-400 text-center mt-4">Votre panier est vide</p>;

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="p-4 bg-neutral-900/80 rounded-xl shadow-md max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4 text-white">Panier</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.productId} className="flex justify-between mb-2 text-gray-200">
            <span>{item.name} x {item.qty}</span>
            <span>${item.price * item.qty}</span>
            <button
              onClick={() => removeFromCart(item.productId)}
              className="ml-2 text-red-500 hover:text-red-400"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <p className="text-white font-semibold mt-4">Total: ${total}</p>
      <button
        onClick={clearCart}
        className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg"
      >
        Vider le panier
      </button>
    </div>
  );
}
