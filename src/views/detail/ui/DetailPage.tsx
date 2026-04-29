'use client';

import { useState } from 'react';
import { Chip } from '@/shared/ui';
import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';
import { CommentCard, CommentForm, ShareModal } from '@/features/detail';

export function DetailPage() {
  const [like, setLike] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onModal = () => {
    setShowModal(false);
  };

  const onlike = () => {
    setLike(!like);
  };

  return (
    <div className="pt-5">
      {/* 타이틀 헤더 */}
      <div className="relative">
        <div className="h-[20rem] w-full overflow-hidden">
          <Image fill sizes="100vw" className="object-cover" src="/test.jpg" alt="" />
        </div>

        <div className="absolute top-0 left-0 flex flex-col justify-end items-start w-full h-[20rem] p-4 bg-black/40">
          <Chip text="K-POP" color="red" />
          <h1 className="!mt-2 text-[1.4rem] text-white font-bold">타이틀이 들어갑니다.</h1>
          <div className="flex justify-end w-full">
            <span className="text-[0.8rem] text-white">2026-02-10</span>
          </div>
        </div>
      </div>

      {/* 컨텐츠  */}
      <div className="py-12">
        {/* 컴포넌트로 빼기 */}
        <p>안녕하세요</p>

        <p>오늘 소개해드릴 내용은 귀여운 고양이입니다.</p>

        <p>반갑습니다.</p>
      </div>

      {/* 좋아요 */}
      <div className="flex justify-between items-center">
        <button className="flex items-center justify-start gap-2" onClick={onlike}>
          <Heart className={like ? 'stroke-red-600' : 'stroke-black'} />
          <span
            className={`relative top-[0.1rem] text-base ${like ? 'text-red-600' : 'text-black'}`}
          >
            35
          </span>
        </button>
        <button onClick={() => setShowModal(true)}>
          <Share2 />
        </button>
      </div>

      {/* 공유하기 모달 */}
      <ShareModal show={showModal} onClick={onModal} />

      {/* 댓글 */}
      <div className="mt-4 py-4 px-2 border-t border-t-gray-200">
        <CommentForm />
      </div>
      <div>
        <CommentCard />
      </div>
    </div>
  );
}
