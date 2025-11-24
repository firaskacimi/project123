"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@uidotdev/usehooks";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial search value only once
  const initialLoaded = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!initialLoaded.current) {
      setSearchTerm(searchParams.get("search") || "");
      initialLoaded.current = true;
    }
  }, [searchParams]);

  // Debounce input
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Update URL ONLY when debounced value changes
  useEffect(() => {
    if (!initialLoaded.current) return;

    const params = new URLSearchParams(window.location.search);

    if (debouncedSearchTerm.trim() !== "") {
      params.set("search", debouncedSearchTerm);
      params.set("page", "1"); // reset page
    } else {
      params.delete("search");
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, router]);

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Rechercher par nom, marque, modèle..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#0f172a] border border-cyan-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
      />

      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="text-xs text-gray-400 hover:text-gray-200 mt-2 underline"
        >
          Effacer la recherche
        </button>
      )}
    </div>
  );
}
