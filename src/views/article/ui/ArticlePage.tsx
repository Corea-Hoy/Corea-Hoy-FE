'use client';

import { Loading } from '@/shared/ui';
import { useArticles } from '@/features/article/model/useArticles';
import { notFound } from 'next/navigation';
import { ArticleComments } from '@/views/article/ui/ArticleComments';
import { ArticleActions } from '@/views/article/ui/ArticleActions';
import { ArticleContent } from '@/views/article/ui/ArticleContent';
import { ArticleThumbnail } from '@/views/article/ui/ArticleThumbnail';

export function ArticlePage() {
  const { newsData, newsIsLoading } = useArticles();

  if (newsIsLoading) return <Loading />;
  if (!newsData) return notFound();

  return (
    <div className="pt-5">
      {/* 타이틀 헤더 */}
      <ArticleThumbnail />

      {/* 컨텐츠  */}
      <ArticleContent />

      {/* 좋아요 */}
      <ArticleActions />

      {/* 댓글 */}
      <ArticleComments />
    </div>
  );
}
