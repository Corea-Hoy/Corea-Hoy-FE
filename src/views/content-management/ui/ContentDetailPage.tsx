'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MOCK_MANAGED_CONTENTS } from '../model/mockData';
import {
  CATEGORY_OPTIONS,
  LANGUAGE_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
  STEP_LABELS,
  STEP_OPTIONS,
  STEP_STYLES,
} from '../model/labels';
import type {
  ContentCategory,
  ContentLanguage,
  ContentStatus,
  ContentStep,
  ManagedContent,
} from '../model/types';

interface ContentDetailPageProps {
  contentId: string;
}

export function ContentDetailPage({ contentId }: ContentDetailPageProps) {
  const router = useRouter();
  const initialContent = MOCK_MANAGED_CONTENTS.find((content) => content.id === contentId) ?? null;
  const [content, setContent] = useState<ManagedContent | null>(initialContent);
  const [draftContent, setDraftContent] = useState<ManagedContent | null>(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  if (!content || !draftContent) {
    return (
      <section className="animate-fade-in">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-black text-black">콘텐츠를 찾을 수 없습니다</h2>
          <p className="mt-2 text-sm font-bold text-gray-400">mock data에 없는 콘텐츠 ID입니다.</p>
          <Link
            href="/admin"
            className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-opacity hover:opacity-80"
          >
            관리자 홈으로
          </Link>
        </div>
      </section>
    );
  }

  function updateDraft(nextFields: Partial<ManagedContent>) {
    setDraftContent((current) => (current ? { ...current, ...nextFields } : current));
  }

  function handleStartEdit() {
    setDraftContent(content);
    setIsEditing(true);
    setFeedbackMessage('');
  }

  function handleCancelEdit() {
    setDraftContent(content);
    setIsEditing(false);
    setFeedbackMessage('');
  }

  function handleCompleteEdit() {
    if (!draftContent) return;

    // TODO: 백엔드 연동 시 PATCH /admin/contents/:id 로 교체합니다.
    // 요청 body 후보: { title, category, status, currentStep, language }
    setContent({ ...draftContent, updatedAt: new Date().toISOString().slice(0, 10) });
    setDraftContent((current) =>
      current ? { ...current, updatedAt: new Date().toISOString().slice(0, 10) } : current,
    );
    setIsEditing(false);
    setFeedbackMessage('수정이 완료되었습니다.');
  }

  function handleDelete() {
    const shouldDelete = window.confirm('이 콘텐츠를 삭제할까요? 삭제 후 복구할 수 없습니다.');
    if (!shouldDelete) return;

    // TODO: 백엔드 연동 시 DELETE /admin/contents/:id 로 교체합니다.
    setContent(null);
    setDraftContent(null);
    router.push('/admin');
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">콘텐츠 상세</p>
          <h2 className="mt-1 text-xl font-black text-black">{content.title}</h2>
          <p className="mt-1 text-sm font-medium text-gray-400">
            콘텐츠 정보를 확인하고 필요한 경우 수정합니다.
          </p>
        </div>
        <Link
          href="/admin"
          className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 transition-colors hover:border-black hover:text-black"
        >
          관리자 홈
        </Link>
      </div>

      {feedbackMessage && (
        <div className="mb-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-black text-green-700">
          {feedbackMessage}
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${
                STEP_STYLES[content.currentStep]
              }`}
            >
              {STEP_LABELS[content.currentStep]}
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${
                  STATUS_STYLES[content.status]
                }`}
              >
                {STATUS_LABELS[content.status]}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-black text-gray-500">
                {LANGUAGE_LABELS[content.language]}
              </span>
            </div>
            <p className="mt-3 text-xs font-bold text-gray-400">
              조회수 {content.views.toLocaleString()} · 수정일 {content.updatedAt}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition-colors cursor-pointer hover:border-gray-400 hover:text-black"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleCompleteEdit}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-black text-white transition-opacity cursor-pointer hover:opacity-80"
                >
                  수정완료
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                className="rounded-xl bg-black px-4 py-2 text-sm font-black text-white transition-opacity cursor-pointer hover:opacity-80"
              >
                수정
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl border-2 border-red-100 px-4 py-2 text-sm font-black text-red-500 transition-colors cursor-pointer hover:border-red-200 hover:text-red-600"
            >
              삭제하기
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 gap-4">
            <label>
              <span className="mb-1.5 block text-xs font-bold text-gray-500">제목</span>
              <input
                value={draftContent.title}
                onChange={(event) => updateDraft({ title: event.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-xs font-bold text-gray-500">상태</span>
                <select
                  value={draftContent.status}
                  onChange={(event) => updateDraft({ status: event.target.value as ContentStatus })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black"
                >
                  <option value="published">{STATUS_LABELS.published}</option>
                  <option value="draft">{STATUS_LABELS.draft}</option>
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-bold text-gray-500">카테고리</span>
                <select
                  value={draftContent.category}
                  onChange={(event) =>
                    updateDraft({ category: event.target.value as ContentCategory })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-bold text-gray-500">현재 단계</span>
                <select
                  value={draftContent.currentStep}
                  onChange={(event) =>
                    updateDraft({ currentStep: event.target.value as ContentStep })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black"
                >
                  {STEP_OPTIONS.map((step) => (
                    <option key={step} value={step}>
                      {STEP_LABELS[step]}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-bold text-gray-500">언어</span>
                <select
                  value={draftContent.language}
                  onChange={(event) =>
                    updateDraft({ language: event.target.value as ContentLanguage })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black"
                >
                  <option value="ko">{LANGUAGE_LABELS.ko}</option>
                  <option value="es">{LANGUAGE_LABELS.es}</option>
                </select>
              </label>
            </div>
          </div>
        ) : (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <dt className="text-xs font-black text-gray-400">제목</dt>
              <dd className="mt-2 text-sm font-black text-black">{content.title}</dd>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <dt className="text-xs font-black text-gray-400">카테고리</dt>
              <dd className="mt-2 text-sm font-black text-black">{content.category}</dd>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <dt className="text-xs font-black text-gray-400">상태</dt>
              <dd className="mt-2 text-sm font-black text-black">
                {STATUS_LABELS[content.status]}
              </dd>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <dt className="text-xs font-black text-gray-400">현재 단계</dt>
              <dd className="mt-2 text-sm font-black text-black">
                {STEP_LABELS[content.currentStep]}
              </dd>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <dt className="text-xs font-black text-gray-400">언어</dt>
              <dd className="mt-2 text-sm font-black text-black">
                {LANGUAGE_LABELS[content.language]}
              </dd>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <dt className="text-xs font-black text-gray-400">조회수</dt>
              <dd className="mt-2 text-sm font-black text-black">
                {content.views.toLocaleString()}
              </dd>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <dt className="text-xs font-black text-gray-400">수정일</dt>
              <dd className="mt-2 text-sm font-black text-black">{content.updatedAt}</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
