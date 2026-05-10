import { Heart, Share2 } from 'lucide-react';
import { useArticles } from '@/features/article/model/useArticles';
import { ShareModal } from '@/features/article';
import { ConfirmModal } from '@/shared/ui';
import { useTranslations } from 'next-intl';

export function ArticleActions() {
  const {
    showShareModal,
    showLoginModal,
    onShare,
    onShareModal,
    newsData,
    like,
    onLikeToggle,
    setShowLoginModal,
    onLikeWithoutLogin,
  } = useArticles();

  const t = useTranslations('content');

  return (
    <>
      <div className="flex justify-between items-center">
        <button
          type="button"
          aria-label="like button"
          aria-pressed={like}
          className="flex items-center justify-start gap-2"
          onClick={onLikeToggle}
        >
          <Heart className={like ? 'stroke-red-600' : 'stroke-black'} />
          <span
            className={`relative top-[0.1rem] text-base ${like ? 'text-red-600' : 'text-black'}`}
          >
            {newsData?._count.likes}
          </span>
        </button>
        <button type="button" aria-label="공유하기 버튼" onClick={onShare}>
          <Share2 />
        </button>
      </div>

      {/* 공유하기 모달 */}
      <ShareModal
        show={showShareModal}
        onClick={onShareModal}
        title={newsData?.titleKo}
        imageUrl={newsData?.thumbnailUrl}
      />

      {/* 좋아요 로그인 유도 모달 */}
      <ConfirmModal
        show={showLoginModal}
        text={t('likeWithoutLogin')}
        onConfirm={onLikeWithoutLogin}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
