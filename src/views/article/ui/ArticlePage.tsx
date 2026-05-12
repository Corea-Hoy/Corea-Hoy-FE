'use client';

import { ConfirmModal, Loading } from '@/shared/ui';
import { useArticles } from '@/features/article/model/useArticles';
import { notFound } from 'next/navigation';
import { ArticleComments } from '@/views/article/ui/ArticleComments';
import { ArticleActions } from '@/views/article/ui/ArticleActions';
import { ArticleContent } from '@/views/article/ui/ArticleContent';
import { ArticleThumbnail } from '@/views/article/ui/ArticleThumbnail';
import { useArticleManage } from '@/features/article/model/useArticleManage';
import { useTranslations } from 'next-intl';

export function ArticlePage() {
  const { newsData, newsIsLoading } = useArticles();
  const t = useTranslations();

  const {
    isLoading,
    showDeletePostModal,
    setShowDeletePostModal,
    onDeletePostModal,
    onDeletePost,
    onEdit,
  } = useArticleManage();

  if (newsIsLoading) return <Loading />;
  if (!newsData) return notFound();

  return (
    <div className="pt-5">
      {/* 타이틀 헤더 */}
      <ArticleThumbnail onDeletePost={onDeletePost} onEdit={onEdit} />

      {/* 컨텐츠  */}
      <ArticleContent />

      {/* 좋아요 */}
      <ArticleActions />

      {/* 댓글 */}
      <ArticleComments />

      {/* 로딩 */}
      {isLoading && <Loading />}

      {/* 게시글 삭제 확인 모달 */}
      <ConfirmModal
        show={showDeletePostModal}
        text={t('content.deleteConfirm')}
        onConfirm={onDeletePostModal}
        onClose={() => setShowDeletePostModal(false)}
      />
    </div>
  );
}
