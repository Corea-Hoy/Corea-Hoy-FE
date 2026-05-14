import { useInfiniteQuery } from '@tanstack/react-query';
import { getArticles } from '../api/articles.api';
import { useCategories } from '@/entities/content/model/useCategories';

interface UseCategoryArticlesParams {
  categoryName: string;
  limit?: number;
  sortOrder?: 'latest' | 'popular';
}

export function useCategoryArticles({
  categoryName,
  limit = 10,
  sortOrder = 'latest',
}: UseCategoryArticlesParams) {
  const { data: categoryData } = useCategories();
  const apiCategories = categoryData?.data || [];

  const categorySlug = apiCategories.find((c) => c.name === categoryName)?.slug || categoryName;

  return useInfiniteQuery({
    queryKey: ['articles', 'category', categorySlug, sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getArticles({
        category: categorySlug,
        page: pageParam,
        limit,
        sort: sortOrder,
      });
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    enabled: !!categorySlug,
  });
}
