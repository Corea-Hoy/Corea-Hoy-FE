import { useInfiniteQuery } from '@tanstack/react-query';
import { getArticles } from '../api/articles.api';

interface UseSearchArticlesParams {
  query: string;
  limit?: number;
  sortOrder?: 'latest' | 'popular';
}

export function useSearchArticles({
  query,
  limit = 15,
  sortOrder = 'latest',
}: UseSearchArticlesParams) {
  return useInfiniteQuery({
    queryKey: ['articles', 'search', query, sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getArticles({
        q: query,
        page: pageParam,
        limit,
        sort: sortOrder,
      });
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const page = Number(lastPage.pagination.page);
      const totalPages = Number(lastPage.pagination.totalPages);

      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!query,
  });
}
