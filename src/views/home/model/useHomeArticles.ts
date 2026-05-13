import { useMemo, useEffect } from 'react';
import { getArticlesData } from './useArticleApi';
import { useArticleStore } from '@/entities/article';

interface UseHomeArticlesParams {
  searchQuery: string;
  sortOrder: 'latest' | 'popular';
  isKo: boolean;
}

export function useHomeArticles({ searchQuery, sortOrder, isKo }: UseHomeArticlesParams) {
  const { articles, setArticles, hasFetched, setHasFetched } = useArticleStore();

  useEffect(() => {
    async function fetchArticles() {
      if (hasFetched) return;
      try {
        const res = await getArticlesData();
        if (res?.data?.articles) {
          setArticles(res.data.articles);
          setHasFetched(true);
        }
      } catch (error) {
        console.error('Failed to fetch articles', error);
      }
    }
    fetchArticles();
  }, [hasFetched, setArticles, setHasFetched]);

  const filtered = useMemo(
    () =>
      articles.filter((c) => {
        const title = isKo ? c.titleKo : c.titleEs;
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      }),
    [articles, isKo, searchQuery],
  );

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (sortOrder === 'popular') return b._count.likes - a._count.likes;
        const dateA = a.publishedAt
          ? new Date(a.publishedAt).getTime()
          : new Date(a.createdAt).getTime();
        const dateB = b.publishedAt
          ? new Date(b.publishedAt).getTime()
          : new Date(b.createdAt).getTime();
        return dateB - dateA;
      }),
    [filtered, sortOrder],
  );

  // 최신 순 뉴스 4개
  const latestArticles = useMemo(
    () =>
      [...articles]
        .sort((a, b) => {
          const dateA = a.publishedAt
            ? new Date(a.publishedAt).getTime()
            : new Date(a.createdAt).getTime();
          const dateB = b.publishedAt
            ? new Date(b.publishedAt).getTime()
            : new Date(b.createdAt).getTime();
          return dateB - dateA;
        })
        .slice(0, 4),
    [articles],
  );

  const hotArticles = useMemo(
    () => [...articles].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8),
    [articles],
  );

  const latestArticleIds = useMemo(
    () => new Set(latestArticles.map((c) => c.id)),
    [latestArticles],
  );

  return { sorted, latestArticles, latestArticleIds, hotArticles };
}
