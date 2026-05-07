'use client';

import { ConfirmModal, Loading } from '@/shared/ui';
import { ShareModal } from '@/features/article';
import { useArticles } from '@/features/article/model/useArticles';
import { notFound } from 'next/navigation';
import { ArticleComments } from '@/views/article/ui/ArticleComments';
import { ArticleActions } from '@/views/article/ui/ArticleActions';
import { ArticleContent } from '@/views/article/ui/ArticleContent';
import { ArticleThumbnail } from '@/views/article/ui/ArticleThumbnail';

export function ArticlePage() {
  const {
    newsData,
    newsIsLoading,
    showShareModal,
    showDeletePostModal,
    setShowDeletePostModal,
    onDeletePostModal,
    onShareModal,
  } = useArticles();

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

      {/* 공유하기 모달 */}
      <ShareModal show={showShareModal} onClick={onShareModal} />

      {/* 게시글 삭제 확인 모달 */}
      <ConfirmModal
        show={showDeletePostModal}
        text="정말 이 게시글을 삭제하시겠습니까?"
        onConfirm={() => setShowDeletePostModal(false)}
        onClose={onDeletePostModal}
      />

    </div>
  );
}
