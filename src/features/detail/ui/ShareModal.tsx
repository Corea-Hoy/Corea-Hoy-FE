'use client';

import { X, Link } from 'lucide-react';
import { ConfirmModal } from '@/shared/ui';
import { useState } from 'react';

interface Props {
  show: boolean;
  onClick: () => void;
}

export function ShareModal({ show, onClick }: Props) {
  const [showModal, setShowModal] = useState(false);

  if (!show) return null;

  const buttonStyle = 'w-[3rem] h-[3rem] border border-gray-200 rounded-full p-2.5';

  const twitterShareFn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?url=${url}`);
  };

  const kakaoShareFn = () => {
    // 카카오 SDK 연동 필요
  };

  const urlShareFn = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShowModal(true);
  };

  const logAndShare = (platform: string, action: () => void) => {
    console.log(`[share] ${platform}`);
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
            이 소식을 함께 나눠보세요.
          </p>
          <div className="flex items-center justify-center gap-4 mt-5">
            <button type="text" aria-label="X로 공유하기" className={buttonStyle} onClick={share.x}>
              <img src="/images/icon/icon-x.webp" alt="x" />
            </button>
            <button
              type="text"
              aria-label="카카오톡으로 공유하기"
              className={buttonStyle}
              onClick={share.kakao}
            >
              <img src="/images/icon/icon-kakao.webp" alt="카카오톡" />
            </button>
            <button
              type="text"
              aria-label="링크로 공유하기"
              className={buttonStyle}
              onClick={share.url}
            >
              <Link />
            </button>
          </div>
        </div>
      </div>

      {/* 링크 확인 모달 */}
      <ConfirmModal
        show={showModal}
        text="링크가 복사되었습니다."
        cancelBtn={false}
        onConfirm={() => setShowModal(false)}
      />
    </div>
  );
}
