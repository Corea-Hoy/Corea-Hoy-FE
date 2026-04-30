'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Chip } from '@/shared/ui';
import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';
import { CommentCard, CommentForm, ShareModal } from '@/features/detail';

export function DetailPage() {
  const [like, setLike] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const contentId = params?.id as string | undefined;
  const isEditMode = searchParams?.get('mode') === 'edit';

  const onModal = () => {
    setShowModal(false);
  };

  const onlike = () => {
    setLike(!like);
  };

  const handleEdit = () => {
    router.push(`/detail/${contentId || 'mock'}?mode=edit`);
  };

  const handleSave = () => {
    window.alert('수정되었습니다.');
    router.push(`/detail/${contentId || 'mock'}`);
  };

  const handleDelete = () => {
    if (window.confirm('정말 이 콘텐츠를 삭제하시겠습니까?')) {
      router.push('/admin');
    }
  };

  return (
    <div className="pt-5">
      {/* 타이틀 헤더 */}
      <div className="relative">
        <div className="absolute right-4 top-4 z-20 flex gap-2">
          {isEditMode ? (
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-black/90 px-3 py-1.5 text-xs font-black text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-black"
            >
              저장
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-black text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
            >
              수정
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-black text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-red-500"
          >
            삭제
          </button>
        </div>

        <div className="h-[20rem] w-full overflow-hidden">
          <Image fill sizes="100vw" className="object-cover" src="/test.jpg" alt="" />
        </div>

        <div className="absolute top-0 left-0 flex flex-col justify-end items-start w-full h-[20rem] p-4 bg-black/40">
          <Chip text="K-POP" color="red" />
          <h1
            className={`!mt-2 text-[1.4rem] text-white font-bold ${
              isEditMode
                ? 'rounded border border-dashed border-white/50 bg-black/30 p-1 outline-none'
                : ''
            }`}
            contentEditable={isEditMode}
            suppressContentEditableWarning
          >
            타이틀이 들어갑니다.
          </h1>
          <div className="flex justify-end w-full">
            <span className="text-[0.8rem] text-white">2026-02-10</span>
          </div>
        </div>
      </div>

      {/* 컨텐츠  */}
      <div
        className={`py-12 ${
          isEditMode
            ? 'rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 outline-none'
            : ''
        }`}
        contentEditable={isEditMode}
        suppressContentEditableWarning
      >
        {/* 컴포넌트로 빼기 */}
        <p>안녕하세요</p>

        <p>오늘 소개해드릴 내용은 귀여운 고양이입니다.</p>

        <p>반갑습니다.</p>
      </div>

      {/* 좋아요 */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          aria-label="좋아요 버튼"
          aria-pressed={like}
          className="flex items-center justify-start gap-2"
          onClick={onlike}
        >
          <Heart className={like ? 'stroke-red-600' : 'stroke-black'} />
          <span
            className={`relative top-[0.1rem] text-base ${like ? 'text-red-600' : 'text-black'}`}
          >
            35
          </span>
        </button>
        <button type="button" aria-label="공유하기 버튼" onClick={() => setShowModal(true)}>
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
