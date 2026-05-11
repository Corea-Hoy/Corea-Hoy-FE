'use client';

import { X, Link } from 'lucide-react';
import { ConfirmModal } from '@/shared/ui';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { kakaoShare } from '@/shared/lib';

interface Props {
  show: boolean;
  onClick: () => void;
  title?: string;
  imageUrl?: string;
}

export function ShareModal({ show, onClick, title = '', imageUrl = '' }: Props) {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations('content');

  if (!show) return null;

  const buttonStyle = 'w-[3rem] h-[3rem] border border-gray-200 rounded-full p-2.5';

  const twitterShareFn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?url=${url}`);
  };

  const kakaoShareFn = () => {
    kakaoShare({ title, imageUrl, url: window.location.href });
  };

  const urlShareFn = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShowModal(true);
  };

  const logAndShare = (platform: string, action: () => void) => {
    action();
  };

  const share = {
    x: () => logAndShare('twitter', twitterShareFn),
    kakao: () => logAndShare('kakao', kakaoShareFn),
    url: () => logAndShare('url', urlShareFn),
  };

  return (
    <div
      className="fixed top-0 left-0 z-100 flex items-center justify-center w-full h-full bg-black/40"
      onClick={onClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="w-[20rem] h-auto rounded-3xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-3">
          <button aria-label="닫기" onClick={onClick}>
            <X />
          </button>
        </div>
        <div className="px-5 pb-8">
          <p id="share-modal-title" className="text-center font-bold">
            {t('shareModal')}
          </p>
          <div className="flex items-center justify-center gap-4 mt-5">
            <button type="button" aria-label="Share on X" onClick={share.x}>
              <div className={buttonStyle}>
                <img src="/images/icon/icon-x.webp" alt="x" />
              </div>
              <span className="text-[0.8rem]">X</span>
            </button>
            <button type="button" aria-label="Share on kakaotalk" onClick={share.kakao}>
              <div className={buttonStyle}>
                <img src="/images/icon/icon-kakao.webp" alt="kakaotalk" />
              </div>
              <span className="text-[0.8rem]">Kakao</span>
            </button>
            <button type="button" aria-label="Share on Link" onClick={share.url}>
              <div className={buttonStyle}>
                <Link />
              </div>
              <span className="text-[0.8rem]">{t('share')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 링크 확인 모달 */}
      <ConfirmModal
        show={showModal}
        text={t('shareSuccess')}
        cancelBtn={false}
        onConfirm={() => setShowModal(false)}
      />
    </div>
  );
}
