import { Heart, Share2 } from 'lucide-react';
import { useArticles } from '@/features/article/model/useArticles';

export function ArticleActions() {
  const { like, setShowShareModal, onLikeToggle } = useArticles();

  return (
    <>
      <div className="flex justify-between items-center">
        <button
          type="button"
          aria-label="좋아요 버튼"
          aria-pressed={like}
          className="flex items-center justify-start gap-2"
          onClick={onLikeToggle}
        >
          <Heart className={like ? 'stroke-red-600' : 'stroke-black'} />
          <span
            className={`relative top-[0.1rem] text-base ${like ? 'text-red-600' : 'text-black'}`}
          >
            35
          </span>
        </button>
        <button type="button" aria-label="공유하기 버튼" onClick={() => setShowShareModal(true)}>
          <Share2 />
        </button>
      </div>
    </>
  );
}
