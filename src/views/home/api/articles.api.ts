import api from '@/shared/api';
import { GetArticlesResponse } from '@/entities/content/model/articles';

export const getArticles = () => {
  return api.get<GetArticlesResponse>('/api/articles');
};
