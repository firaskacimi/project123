// hooks/useCategoryProducts.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export const useCategoryProducts = (categoryId: string) => {
  return useQuery({
    queryKey: ["categoryProducts", categoryId],
    queryFn: async () => {
      const res = await api.get(`/category/${categoryId}/products`);
      return res.data?.data || res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes caching
  });
};
