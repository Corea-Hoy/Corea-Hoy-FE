import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryResponse {
  success: boolean;
  data: Category[];
}

const getCategoriesApi = () => {
  return api.get<CategoryResponse>('/api/categories').then((res) => res.data);
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
    staleTime: 1000 * 60 * 60, // 1시간 캐싱
  });
};
