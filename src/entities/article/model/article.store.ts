import { create } from 'zustand';
import { Article } from '@/entities/content/model/articles';

interface ArticleState {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  hasFetched: boolean;
  setHasFetched: (status: boolean) => void;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  setArticles: (articles) => set({ articles }),
  hasFetched: false,
  setHasFetched: (status) => set({ hasFetched: status }),
}));
