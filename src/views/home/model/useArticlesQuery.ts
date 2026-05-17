import { useQuery } from '@tanstack/react-query';
import { getArticles, GetArticlesParams } from '../api/articles.api';

export function useArticlesQuery(params: GetArticlesParams) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: async () => {
      const res = await getArticles(params);
      return res.data.data.articles;
    },
  });
}
