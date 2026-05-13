'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CATEGORY_OPTIONS, STEP_OPTIONS, STEP_STYLES } from '../model/labels';
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
  onEditPublished?: (contentId: string) => void;
}

export function ContentManagementPage({
  contents,
  isLoading,
  onDeleteContent,
  onContinueDraft,
  onEditPublished,
}: ContentManagementPageProps) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  const [activeTab, setActiveTab] = useState<StatusTab>(getInitialActiveTab);
  const [pipelineFilter, setPipelineFilter] = useState<FilterStep>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [languageFilter, setLanguageFilter] = useState<FilterLanguage>('all');
  const [draftSortKey, setDraftSortKey] = useState<SortKey | null>(null);
  const [draftSortDirection, setDraftSortDirection] = useState<SortDirection | null>(null);
  const [publishedSortKey, setPublishedSortKey] = useState<SortKey | null>(null);
  const [publishedSortDirection, setPublishedSortDirection] = useState<SortDirection | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const STATUS_TABS: { value: StatusTab; label: string }[] = [
    { value: 'all', label: t('filterAll') },
    { value: 'draft', label: t('statusDraft') },
    { value: 'published', label: t('statusPublished') },
  ];

  const STEP_LABELS: Record<ContentStep, string> = {
    select_article: t('stepSelectArticle'),
    review_content: t('stepReviewContent'),
    review_translation: t('stepReviewTranslation'),
    preview: t('stepPreview'),
    published: t('stepPublished'),
  };

  const STATUS_LABELS: Record<ContentStatus, string> = {
    published: t('statusPublished'),
    draft: t('statusDraft'),
  };

  const STATUS_STYLES: Record<ContentStatus, string> = {
    published: 'bg-green-50 text-green-700',
    draft: 'bg-gray-100 text-gray-600',
  };

  const LANGUAGE_LABELS: Record<ContentLanguage, string> = {
    ko: t('langKoLabel'),
    es: t('langEsLabel'),
  };

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
    { key: 'draft', title: t('draftSection'), items: draftContents },
    { key: 'published', title: t('publishedSection'), items: publishedContents },
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
    const shouldDelete = window.confirm(t('deleteContentConfirm'));
    if (!shouldDelete) return;

    setDeletingIds((prev) => new Set(prev).add(contentId));
    try {
      await onDeleteContent(contentId);
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert(t('deleteContentError'));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(contentId);
        return next;
      });
    }
  }

  function handleEditPublishedContent(content: ManagedContent) {
    onEditPublished?.(content.id);
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
              <th className="px-4 py-3 text-xs font-black text-gray-500">{t('colTitle')}</th>
              <th className="px-4 py-3 text-center text-xs font-black text-gray-500">
                {t('colCategory')}
              </th>
              {tableShowStatusColumn && (
                <th className="px-4 py-3 text-center text-xs font-black text-gray-500">
                  {t('colStatus')}
                </th>
              )}
              {tableShowPipelineColumn && (
                <th className="w-40 px-4 py-3 text-center text-xs font-black text-gray-500">
                  {t('colCurrentStep')}
                </th>
              )}
              <th className="px-4 py-3 text-center text-xs font-black text-gray-500">
                {t('colLanguage')}
              </th>
              {tableShowViewsColumn && (
                <th className="px-4 py-3 text-center">
                  {renderSortableHeader(t('colViews'), 'views', sectionKey)}
                </th>
              )}
              <th className="px-4 py-3 text-center">
                {renderSortableHeader(t('colUpdatedAt'), 'updatedAt', sectionKey)}
              </th>
              <th className="px-4 py-3 text-center text-xs font-black text-gray-500">
                {t('colActions')}
              </th>
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
                  {t('noContents')}
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
                          {t('continueDraft')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContent(content.id)}
                          disabled={deletingIds.has(content.id)}
                          className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-black text-red-500 transition-colors cursor-pointer hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingIds.has(content.id) ? t('deleting') : tCommon('delete')}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditPublishedContent(content)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-gray-600 shadow-sm transition-colors hover:border-black hover:text-black"
                        >
                          {tCommon('edit')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContent(content.id)}
                          disabled={deletingIds.has(content.id)}
                          className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-black text-red-500 shadow-sm transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingIds.has(content.id) ? t('deleting') : tCommon('delete')}
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
        <h2 className="text-xl font-black text-black">{t('tabList')}</h2>
        <p className="mt-1 text-sm font-medium text-gray-400">{t('cmSubtitle')}</p>
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
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">
            {t('filter')}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {isDraftTab && (
              <label>
                <span className="mb-1.5 block text-xs font-bold text-gray-500">
                  {t('pipelineFilter')}
                </span>
                <select
                  value={pipelineFilter}
                  onChange={(event) => setPipelineFilter(event.target.value as FilterStep)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black lg:w-44"
                >
                  <option value="all">{t('filterAll')}</option>
                  {STEP_OPTIONS.map((step) => (
                    <option key={step} value={step}>
                      {STEP_LABELS[step]}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              <span className="mb-1.5 block text-xs font-bold text-gray-500">
                {t('categoryFilter')}
              </span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as FilterCategory)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black lg:w-40"
              >
                <option value="all">{t('filterAll')}</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-bold text-gray-500">
                {t('languageFilter')}
              </span>
              <select
                value={languageFilter}
                onChange={(event) => setLanguageFilter(event.target.value as FilterLanguage)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black lg:w-40"
              >
                <option value="all">{t('filterAll')}</option>
                <option value="es">{t('langEsLabel')}</option>
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
