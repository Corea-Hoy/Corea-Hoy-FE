'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Chip } from '@/shared/ui';
import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';
import { CommentCard, CommentForm, ShareModal } from '@/features/detail';
import { RichTextEditor } from '@/shared/ui/rich-text-editor/RichTextEditor';

const INITIAL_TITLE = '타이틀이 들어갑니다.';
const INITIAL_BODY =
  '<p>안녕하세요</p><p>오늘 소개해드릴 내용은 귀여운 고양이입니다.</p><p>반갑습니다.</p>';

export function DetailPage() {
  const [like, setLike] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editableTitle, setEditableTitle] = useState(INITIAL_TITLE);
  const [editableBody, setEditableBody] = useState(INITIAL_BODY);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const contentId = params?.id as string | undefined;
  const isEditMode = searchParams?.get('mode') === 'edit';
  const isAdminView = searchParams?.get('admin') === 'true' || isEditMode;

  const onModal = () => {
    setShowModal(false);
  };

  const onlike = () => {
    setLike(!like);
  };

  const handleEdit = () => {
    router.push(`/detail/${contentId || 'mock'}?mode=edit`);
  };

  const handleSave = async () => {
    const newTitle = editableTitle.trim();
    const newBody = editableBody.replaceAll(/<[^>]*>/g, '').trim();

    if (!newTitle || !newBody) {
      window.alert('제목과 본문을 모두 입력해주세요.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      window.alert('수정되었습니다.');
      router.push(`/detail/${contentId || 'mock'}`);
    } catch {
      window.alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="pt-5">
      {/* 관리자 툴바 (어드민 뷰일 때만 노출) */}
      {isAdminView && (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black text-black">
              {isEditMode ? '콘텐츠 수정 모드' : '콘텐츠 관리'}
            </span>
            <span className="mt-1 text-xs font-medium text-gray-500">
              {isEditMode
                ? '텍스트를 클릭하여 내용을 수정할 수 있습니다.'
                : '발행된 콘텐츠를 확인하고 관리할 수 있습니다.'}
            </span>
          </div>
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push(`/detail/${contentId || 'mock'}?admin=true`)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-black px-4 py-2 text-xs font-black text-white shadow-sm transition-colors hover:bg-gray-800"
                >
                  수정 완료
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-black"
              >
                수정
              </button>
            )}
          </div>
        </div>
      )}

      {/* 타이틀 헤더 */}
      <div className="relative">
        <div className="h-[20rem] w-full overflow-hidden">
          <Image fill sizes="100vw" className="object-cover" src="/test.jpg" alt="" />
        </div>

        <div className="absolute top-0 left-0 flex flex-col justify-end items-start w-full h-[20rem] p-4 bg-black/40">
          <Chip text="K-POP" color="red" />
          {isEditMode ? (
            <input
              value={editableTitle}
              onChange={(event) => setEditableTitle(event.target.value)}
              className="!mt-2 w-full rounded border border-dashed border-white/50 bg-black/30 p-1 text-[1.4rem] font-bold text-white outline-none placeholder:text-white/60"
              placeholder="제목을 입력하세요"
            />
          ) : (
            <h1 className="!mt-2 text-[1.4rem] font-bold text-white">{editableTitle}</h1>
          )}
          <div className="flex justify-end w-full">
            <span className="text-[0.8rem] text-white">2026-02-10</span>
          </div>
        </div>
      </div>

      {/* 컨텐츠  */}
      {isEditMode ? (
        <div className="py-12">
          <RichTextEditor
            value={editableBody}
            onChange={setEditableBody}
            minHeightClassName="min-h-[320px]"
            placeholder="콘텐츠 본문"
          />
        </div>
      ) : (
        <div
          className="rich-text-renderer py-12"
          dangerouslySetInnerHTML={{ __html: editableBody }}
        />
      )}

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
