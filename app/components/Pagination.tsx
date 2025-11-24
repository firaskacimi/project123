"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaginationProps {
  totalPages: number;
  totalResults?: number;
  limit?: number;
}

export default function Pagination({
  totalPages,
  totalResults,
  limit = 12,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // SSR safety: searchParams may be undefined
  const getPageFromParams = () => {
    if (!searchParams) return 1;
    const pageStr = searchParams.get("page");
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    return isNaN(page) ? 1 : page;
  };

  const [currentPage, setCurrentPage] = useState(getPageFromParams());

  useEffect(() => {
    setCurrentPage(getPageFromParams());
  }, [searchParams]);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    // Use router.replace for query param navigation, but stay on current pathname
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startResult = (currentPage - 1) * limit + 1;
  const endResult = Math.min(currentPage * limit, totalResults || 0);

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      {totalResults && (
        <p className="text-sm text-gray-400">
          Affichage {startResult} à {endResult} sur {totalResults} résultats
        </p>
      )}

      <div className="flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#111827] text-gray-300 border border-cyan-800 hover:bg-purple-700 hover:border-purple-600 active:bg-purple-800"
        >
          ← Précédent
        </button>

        <div className="flex gap-1">
          {pageNumbers.map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
              className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                page === currentPage
                  ? "bg-purple-600 text-white border border-purple-500"
                  : page === "..."
                  ? "bg-transparent text-gray-400 cursor-default border border-transparent"
                  : "bg-[#111827] text-gray-300 border border-cyan-800 hover:bg-purple-700 hover:border-purple-600 active:bg-purple-800"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#111827] text-gray-300 border border-cyan-800 hover:bg-purple-700 hover:border-purple-600 active:bg-purple-800"
        >
          Suivant →
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Page {currentPage} sur {totalPages}
      </p>
    </div>
  );
}
