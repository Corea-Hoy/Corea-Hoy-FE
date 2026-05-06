'use client';

import { Chip, ConfirmModal, Loading } from '@/shared/ui';
import Image from 'next/image';
import { Heart, Share2, UserRound } from 'lucide-react';
import { CommentCard, CommentForm, ShareModal } from '@/features/detail';
import { useDetails } from '@/features/detail/model/useDetails';
import { formatDate } from '@/shared/utils/formatDate';

export function DetailPage() {
  const {
    title,
    body,
    note,
    data,
    isLoading,
    error,
    like,
    showShareModal,
    showDeletePostModal,
    setLike,
    setShowShareModal,
    setShowDeletePostModal,
    onEdit,
    onDeletePostModal,
    onDeletePost,
    onShareModal,
    onLikeToggle,
  } = useDetails();

  if (isLoading) return <Loading />;

  const buttonStyle = 'h-[2rem] w-[3rem] text-base border leading-none rounded-xl';

  return (
    <div className="pt-5">
      {/* 타이틀 헤더 */}
      <div className="relative">
        <div className="h-[20rem] w-full overflow-hidden">
          <Image fill sizes="100vw" className="object-cover" src="/test.jpg" alt="" />
        </div>

        <div className="absolute right-[0.7rem] top-4 z-50 flex gap-1">
          <button className={`${buttonStyle} text-red-600 bg-red-100`} onClick={onDeletePost}>
            삭제
          </button>
          <button className={`${buttonStyle} text-green-700 bg-green-100`} onClick={onEdit}>
            수정
          </button>
        </div>

        <div className="absolute top-0 left-0 flex flex-col justify-end items-start w-full h-[20rem] p-4 bg-black/40">
          <Chip text="K-POP" color="red" />
          <h1 className="!mt-2 text-[1.4rem] text-white font-bold">{title}</h1>
          <div className="flex justify-between w-full mt-[1rem] text-[0.8rem] text-white">
            <span className="flex items-center justify-start">
              <UserRound color="#ffffff" className="h-[1rem]" />
              {data.viewCount}
            </span>
            <span>{formatDate(data.publishedAt)}</span>
          </div>
        </div>
      </div>

      {/* 컨텐츠  */}
      <div className="py-12">
        {/* Todo 컴포넌트로 빼기 */}
        <p>{body}</p>

        {/* 요약 */}
        <div className="my-8 p-4 border border-amber-200 rounded-xl bg-amber-50">
          <h3 className="text-amber-500 font-bold">오늘의 한국 한 스푼</h3>
          <p className="mt-3 text-amber-500">{note}</p>
        </div>
      </div>

      {/* 좋아요 */}
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

      {/* 공유하기 모달 */}
      <ShareModal show={showShareModal} onClick={onShareModal} />

      {/* 댓글 */}
      <div className="mt-4 py-4 px-2 border-t border-t-gray-200">
        <CommentForm />
      </div>
      <div>
        <CommentCard />
      </div>

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
