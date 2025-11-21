"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ComponentItem = { name: string; category?: string };

export default function MyPCSummary() {
  const [exists, setExists] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [components, setComponents] = useState<ComponentItem[]>([]);

  useEffect(() => {
    try {
      // look for a cart item with _id === 'custom-pc'
      const raw = localStorage.getItem("cart");
      if (raw) {
        const cart = JSON.parse(raw);
        if (Array.isArray(cart)) {
          const custom = cart.find((it: any) => it?._id === "custom-pc" || it?.productId === "custom-pc");
          if (custom) {
            setExists(true);
            setName(custom.name || "Mon PC personnalisé");
            setPrice(typeof custom.price === "number" ? custom.price : Number(custom.price) || null);
            setComponents(Array.isArray(custom.components) ? custom.components : []);
            return;
          }
        }
      }

      // fallback: check direct key
      const direct = localStorage.getItem("custom-pc");
      if (direct) {
        const obj = JSON.parse(direct);
        setExists(true);
        setName(obj.name || "Mon PC personnalisé");
        setPrice(obj.price || null);
        setComponents(obj.components || []);
        return;
      }

      setExists(false);
    } catch (err) {
      setExists(false);
    }
  }, []);

  return (
    <div className="w-full sm:w-80 bg-zinc-900 border border-zinc-700 rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-2">Mon PC personnalisé</h3>

      {exists ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-300">{name}</div>
          <div className="text-sm text-gray-400">
            {components && components.length > 0 ? (
              <span>{components.slice(0, 3).map((c) => c.name).join(", ")}{components.length > 3 ? "…" : ""}</span>
            ) : (
              <span className="italic text-gray-500">Aucun composant listé</span>
            )}
          </div>
          <div className="text-sm font-bold">{price ? price.toFixed(2) + " TND" : "—"}</div>
          <Link
            href="/customized"
            className="inline-block mt-2 px-3 py-2 bg-cyan-400 text-black rounded font-medium hover:bg-cyan-300"
          >
            Voir / Modifier
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-gray-400">Vous n'avez pas encore construit de PC.</div>
          <Link
            href="/customized"
            className="inline-block mt-2 px-3 py-2 bg-cyan-400 text-black rounded font-medium hover:bg-cyan-300"
          >
            Commencer
          </Link>
        </div>
      )}
    </div>
  );
}
