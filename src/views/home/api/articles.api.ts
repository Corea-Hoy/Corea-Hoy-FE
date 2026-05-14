import api from '@/shared/api';
import { GetArticlesResponse, Article } from '@/entities/content/model/articles';

export interface GetArticlesParams {
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;
}

export const getArticles = (params?: GetArticlesParams) => {
  return api.get<GetArticlesResponse>('/api/articles', { params });
};

export const getSuggestions = (query: string) => {
  return api.get<{ success: boolean; data: Article[] }>(`/api/articles/suggestions`, {
    params: { q: query },
  });
};
