import { useCallback } from "react";
import { api } from "@/app/lib/axios";
import { isPaginatedResponse, PaginationMeta } from "../utils/types";

export function useApi() {
  const fetchPaginatedData = useCallback(
    async <T>(
      url: string
    ): Promise<{ data: T[]; pagination: PaginationMeta } | null> => {
      try {
        const res = await api.get(url);
        const responseData = res.data;

        // Validate response format
        if (!isPaginatedResponse<T>(responseData)) {
          throw new Error(
            responseData.message ||
              "Réponse API invalide - format attendu non reçu"
          );
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