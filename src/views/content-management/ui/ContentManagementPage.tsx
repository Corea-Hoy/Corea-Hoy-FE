'use client';

import { useMemo, useState } from 'react';
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

type StatusTab = 'all' | ContentStatus;
type FilterStep = 'all' | ContentStep;
type FilterCategory = 'all' | ContentCategory;
type FilterLanguage = 'all' | ContentLanguage;
type SortKey = 'views' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'draft', label: STATUS_LABELS.draft },
  { value: 'published', label: STATUS_LABELS.published },
];

function getInitialActiveTab(): StatusTab {
  if (typeof window === 'undefined') return 'all';

  const saved = sessionStorage.getItem('coreahoy-content-management-tab');
  return saved === 'all' || saved === 'draft' || saved === 'published' ? saved : 'all';
}

function sortContents(
  contents: ManagedContent[],
  sortKey: SortKey | null,
  sortDirection: SortDirection | null,
) {
  if (!sortKey || !sortDirection) return contents;

  return [...contents].sort((a, b) => {
    if (sortKey === 'views') {
      return sortDirection === 'desc' ? b.views - a.views : a.views - b.views;
    }

    const dateDifference = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    return sortDirection === 'desc' ? dateDifference : -dateDifference;
  });
}

interface ContentManagementPageProps {
  contents: ManagedContent[];
  isLoading: boolean;
  onDeleteContent: (contentId: string) => Promise<void>;
  onContinueDraft?: (contentId: string, contentStep: ContentStep) => void;
}

export function ContentManagementPage({
  contents,
  isLoading,
  onDeleteContent,
  onContinueDraft,
}: ContentManagementPageProps) {
  const [activeTab, setActiveTab] = useState<StatusTab>(getInitialActiveTab);
  const [pipelineFilter, setPipelineFilter] = useState<FilterStep>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [languageFilter, setLanguageFilter] = useState<FilterLanguage>('all');
  const [draftSortKey, setDraftSortKey] = useState<SortKey | null>(null);
  const [draftSortDirection, setDraftSortDirection] = useState<SortDirection | null>(null);
  const [publishedSortKey, setPublishedSortKey] = useState<SortKey | null>(null);
  const [publishedSortDirection, setPublishedSortDirection] = useState<SortDirection | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const isAllTab = activeTab === 'all';
  const isDraftTab = activeTab === 'draft';
  const isPublishedTab = activeTab === 'published';
  const showStatusColumn = isAllTab;
  const showPipelineColumn = isAllTab || isDraftTab;
  const showViewsColumn = isAllTab || isPublishedTab;

  const counts = useMemo(
    () => ({
      all: contents.length,
      draft: contents.filter((content) => content.status === 'draft').length,
      published: contents.filter((content) => content.status === 'published').length,
    }),
    [contents],
  );

  const baseFilteredContents = useMemo(() => {
    return contents.filter((content) => {
      const matchesStatus = activeTab === 'all' || content.status === activeTab;
      const matchesPipeline =
        !isDraftTab || pipelineFilter === 'all' || content.currentStep === pipelineFilter;
      const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter;
      const matchesLanguage = languageFilter === 'all' || content.language === languageFilter;

      return matchesStatus && matchesPipeline && matchesCategory && matchesLanguage;
    });
  }, [activeTab, categoryFilter, contents, isDraftTab, languageFilter, pipelineFilter]);

  const draftContents = useMemo(() => {
    const drafts = baseFilteredContents.filter((content) => content.status === 'draft');
    return sortContents(drafts, draftSortKey, draftSortDirection);
  }, [baseFilteredContents, draftSortKey, draftSortDirection]);

  const publishedContents = useMemo(() => {
    const published = baseFilteredContents.filter((content) => content.status === 'published');
    return sortContents(published, publishedSortKey, publishedSortDirection);
  }, [baseFilteredContents, publishedSortKey, publishedSortDirection]);

  const groupedSections = [
    { key: 'draft', title: '임시저장', items: draftContents },
    { key: 'published', title: '발행됨', items: publishedContents },
  ];

  function handleTabChange(nextTab: StatusTab) {
    setActiveTab(nextTab);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('coreahoy-content-management-tab', nextTab);
    }
    setPipelineFilter('all');
    setDraftSortKey(null);
    setDraftSortDirection(null);
    setPublishedSortKey(null);
    setPublishedSortDirection(null);
  }

  function handleSort(nextSortKey: SortKey, sectionKey: 'draft' | 'published') {
    if (sectionKey === 'draft') {
      if (draftSortKey === nextSortKey) {
        if (draftSortDirection === 'desc') setDraftSortDirection('asc');
        else if (draftSortDirection === 'asc') {
          setDraftSortKey(null);
          setDraftSortDirection(null);
        }
      } else {
        setDraftSortKey(nextSortKey);
        setDraftSortDirection('desc');
      }
    } else {
      if (publishedSortKey === nextSortKey) {
        if (publishedSortDirection === 'desc') setPublishedSortDirection('asc');
        else if (publishedSortDirection === 'asc') {
          setPublishedSortKey(null);
          setPublishedSortDirection(null);
        }
      } else {
        setPublishedSortKey(nextSortKey);
        setPublishedSortDirection('desc');
      }
    }
  }

  async function handleDeleteContent(contentId: string) {
    const shouldDelete = window.confirm('정말 이 콘텐츠를 삭제하시겠습니까?');
    if (!shouldDelete) return;

    setDeletingIds((prev) => new Set(prev).add(contentId));
    try {
      await onDeleteContent(contentId);
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(contentId);
        return next;
      });
    }
  }

  function handleEditPublishedContent(content: ManagedContent) {
    const params = new URLSearchParams(window.location.search);
    params.set('mode', 'edit');
    window.location.href = `/article/${content.id}?${params.toString()}`;
  }

  function handleContinueDraft(content: ManagedContent) {
    onContinueDraft?.(content.id, content.currentStep);
  }

  function renderSortableHeader(
    label: string,
    nextSortKey: SortKey,
    sectionKey: 'draft' | 'published',
  ) {
    const currentSortKey = sectionKey === 'draft' ? draftSortKey : publishedSortKey;
    const currentSortDirection =
      sectionKey === 'draft' ? draftSortDirection : publishedSortDirection;
    const isActive = currentSortKey === nextSortKey;

    return (
      <button
        type="button"
        onClick={() => handleSort(nextSortKey, sectionKey)}
        className={`inline-flex items-center justify-center gap-1.5 text-xs font-black transition-colors cursor-pointer ${isActive ? 'text-black' : 'text-gray-500 hover:text-black'}`}
      >
        {label}
        <div className="flex flex-col text-[8px] leading-[8px] opacity-80">
          <span
            className={isActive && currentSortDirection === 'asc' ? 'text-black' : 'text-gray-300'}
          >
            ▲
          </span>
          <span
            className={isActive && currentSortDirection === 'desc' ? 'text-black' : 'text-gray-300'}
          >
            ▼
          </span>
        </div>
      </button>
    );
  }

  function renderLanguageLabel(content: ManagedContent) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
        {LANGUAGE_LABELS[content.language]}
      </span>
    );
  }

  function renderContentTable(items: ManagedContent[], sectionKey: 'draft' | 'published') {
    const tableShowStatusColumn = showStatusColumn;
    const tableShowPipelineColumn = sectionKey ? sectionKey === 'draft' : showPipelineColumn;
    const tableShowViewsColumn = sectionKey ? sectionKey === 'published' : showViewsColumn;
    const tableColumnCount =
      5 +
      (tableShowStatusColumn ? 1 : 0) +
      (tableShowPipelineColumn ? 1 : 0) +
      (tableShowViewsColumn ? 1 : 0);

    return (
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[1040px] border-collapse text-left">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-black text-gray-500">제목</th>
              <th className="px-4 py-3 text-center text-xs font-black text-gray-500">카테고리</th>
              {tableShowStatusColumn && (
                <th className="px-4 py-3 text-center text-xs font-black text-gray-500">상태</th>
              )}
              {tableShowPipelineColumn && (
                <th className="w-40 px-4 py-3 text-center text-xs font-black text-gray-500">
                  현재 단계
                </th>
              )}
              <th className="px-4 py-3 text-center text-xs font-black text-gray-500">언어</th>
              {tableShowViewsColumn && (
                <th className="px-4 py-3 text-center">
                  {renderSortableHeader('조회수', 'views', sectionKey)}
                </th>
              )}
              <th className="px-4 py-3 text-center">
                {renderSortableHeader('수정일', 'updatedAt', sectionKey)}
              </th>
              <th className="px-4 py-3 text-center text-xs font-black text-gray-500">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={tableColumnCount} className="px-4 py-4">
                    <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumnCount}
                  className="px-4 py-12 text-center text-sm font-bold text-gray-400"
                >
                  조건에 맞는 콘텐츠가 없습니다.
                </td>
              </tr>
            ) : (
              items.map((content) => (
                <tr key={content.id} className="group hover:bg-gray-50">
                  <td className="max-w-[320px] px-4 py-4 text-sm font-black text-black">
                    {content.status === 'draft' ? (
                      <button
                        type="button"
                        onClick={() => handleContinueDraft(content)}
                        className="block max-w-full truncate text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 group-hover:underline"
                      >
                        {content.title}
                      </button>
                    ) : (
                      <a
                        href={`/article/${content.id}?admin=true`}
                        className="block truncate outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 group-hover:underline"
                      >
                        {content.title}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-bold text-gray-600">
                    {content.category}
                  </td>
                  {tableShowStatusColumn && (
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${
                          STATUS_STYLES[content.status]
                        }`}
                      >
                        {STATUS_LABELS[content.status]}
                      </span>
                    </td>
                  )}
                  {tableShowPipelineColumn && (
                    <td className="px-4 py-4 text-center">
                      {content.status === 'draft' ? (
                        <span
                          className={`inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-[11px] font-black ${
                            STEP_STYLES[content.currentStep]
                          }`}
                          title={STEP_LABELS[content.currentStep]}
                        >
                          {STEP_LABELS[content.currentStep]}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-gray-300">-</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-4 text-center">{renderLanguageLabel(content)}</td>
                  {tableShowViewsColumn && (
                    <td className="px-4 py-4 text-center text-sm font-bold text-gray-600">
                      {content.status === 'published' ? content.views.toLocaleString() : '-'}
                    </td>
                  )}
                  <td className="px-4 py-4 text-center text-sm font-bold text-gray-400">
                    {content.updatedAt}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {content.status === 'draft' ? (
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleContinueDraft(content)}
                          className="rounded-lg bg-black px-3 py-1.5 text-xs font-black text-white transition-opacity cursor-pointer hover:opacity-80"
                        >
                          이어서 작업하기
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContent(content.id)}
                          disabled={deletingIds.has(content.id)}
                          className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-black text-red-500 transition-colors cursor-pointer hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingIds.has(content.id) ? '삭제 중...' : '삭제'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditPublishedContent(content)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-gray-600 shadow-sm transition-colors hover:border-black hover:text-black"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContent(content.id)}
                          disabled={deletingIds.has(content.id)}
                          className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-black text-red-500 shadow-sm transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingIds.has(content.id) ? '삭제 중...' : '삭제'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-5">
        <h2 className="text-xl font-black text-black">콘텐츠 관리</h2>
        <p className="mt-1 text-sm font-medium text-gray-400">
          생성된 콘텐츠의 발행 상태와 작업 단계를 관리합니다.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={`rounded-xl border px-5 py-2.5 text-sm font-black transition-colors cursor-pointer ${
              activeTab === tab.value
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black'
            }`}
          >
            {tab.label} ({counts[tab.value]})
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">필터</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {isDraftTab && (
              <label>
                <span className="mb-1.5 block text-xs font-bold text-gray-500">
                  파이프라인 필터
                </span>
                <select
                  value={pipelineFilter}
                  onChange={(event) => setPipelineFilter(event.target.value as FilterStep)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black lg:w-44"
                >
                  <option value="all">전체</option>
                  {STEP_OPTIONS.map((step) => (
                    <option key={step} value={step}>
                      {STEP_LABELS[step]}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              <span className="mb-1.5 block text-xs font-bold text-gray-500">카테고리 필터</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as FilterCategory)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black lg:w-40"
              >
                <option value="all">전체</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-bold text-gray-500">언어 필터</span>
              <select
                value={languageFilter}
                onChange={(event) => setLanguageFilter(event.target.value as FilterLanguage)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black lg:w-40"
              >
                <option value="all">전체</option>
                <option value="es">{LANGUAGE_LABELS.es}</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {isAllTab ? (
        <div className="flex flex-col gap-6">
          {groupedSections.map((section) => (
            <section key={section.key}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black text-black">
                  {section.title} ({section.items.length})
                </h3>
              </div>
              {renderContentTable(section.items, section.key as 'draft' | 'published')}
            </section>
          ))}
        </div>
      ) : activeTab === 'draft' ? (
        renderContentTable(draftContents, 'draft')
      ) : (
        renderContentTable(publishedContents, 'published')
      )}
    </section>
  );
}
