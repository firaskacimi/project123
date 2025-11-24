import { useCallback } from "react";
import { isPaginatedResponse, PaginationMeta } from "../utils/types";

export function useApi() {
  const fetchPaginatedData = useCallback(
    async <T>(
      url: string
    ): Promise<{ data: T[]; pagination: PaginationMeta } | null> => {
      try {
        const res = await fetch(url);
        const responseData = await res.json();

        // Validate response format
        if (!isPaginatedResponse<T>(responseData)) {
          throw new Error(
            responseData.message ||
              "Réponse API invalide - format attendu non reçu"
          );
        }

        if (!res.ok) {
          throw new Error(responseData.message || "Erreur API");
        }

        return {
          data: responseData.data,
          pagination: responseData.pagination,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Une erreur est survenue";
        throw new Error(message);
      }
    },
    []
  );

  return { fetchPaginatedData };
}