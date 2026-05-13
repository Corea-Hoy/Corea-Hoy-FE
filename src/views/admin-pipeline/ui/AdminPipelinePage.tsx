'use client';

import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  AdminCandidateArticle,
  GeneratedContent,
  PipelineStep,
  TranslatedContent,
  TranslationTargetLanguageSelection,
} from '../model/types';
import { ContentManagementPage } from '@/views/content-management/ui/ContentManagementPage';

import { getTextFromRichTextHtml } from '@/shared/ui/rich-text-editor/getTextFromRichTextHtml';
import { ArticleSelectCard } from './ArticleSelectCard';
import { ContentReviewStep } from './ContentReviewStep';
import { PipelineSteps } from './PipelineSteps';
import { PreviewPublishStep } from './PreviewPublishStep';
import { TranslationReviewStep } from './TranslationReviewStep';
import { WorkflowControlPanel } from './WorkflowControlPanel';
import { adminApi, type AdminArticle, type DbCategory } from '@/features/admin/api/admin.api';
import type { ManagedContent, ContentStep } from '@/views/content-management/model/types';
import { ContentEditStep, type EditFormData } from './ContentEditStep';
import { useTranslations } from 'next-intl';

const DRAFT_STORAGE_KEY = 'coreahoy-admin-pipeline-draft';
const SESSION_STORAGE_KEY = 'coreahoy-admin-pipeline-session';
const PUBLISH_RETURN_DELAY_MS = 2000;

type AdminSection = 'home' | 'pipeline' | 'content-management' | 'content-edit';
type ToastState = {
  title: string;
  message: string;
} | null;
type SaveStatus = 'idle' | 'saved' | 'dirty';
type SavedDraft = {
  savedArticleId: string | null;
  currentStep: PipelineStep;
  selectedArticleId: string | null;
  generatedContent: GeneratedContent | null;
  translatedContent: TranslatedContent | null;
  translationTargetLanguage: TranslationTargetLanguageSelection;
  hasCompletedContentReview: boolean;
  hasReviewedTranslation: boolean;
  isPublished: boolean;
  saved: true;
};

function draftStepToContentStep(draftStep: AdminArticle['draftStep']): ContentStep {
  if (draftStep === 'select') return 'select_article';
  if (draftStep === 'review_ko') return 'review_content';
  if (draftStep === 'review_es') return 'review_translation';
  return 'preview';
}

function getPipelineStepFromContentStep(step: ContentStep): PipelineStep {
  if (step === 'select_article') return 'select-article';
  if (step === 'review_content') return 'review-content';
  if (step === 'review_translation') return 'review-translation';
  return 'preview';
}

function pipelineStepToDraftStep(
  step: PipelineStep,
): 'select' | 'review_ko' | 'review_es' | 'preview' {
  if (step === 'select-article') return 'select';
  if (step === 'review-content') return 'review_ko';
  if (step === 'review-translation') return 'review_es';
  return 'preview';
}

const categoryMap: Record<string, ManagedContent['category']> = {
  정치: '뉴스',
  경제: '뉴스',
  사회: '뉴스',
  문화: '문화',
  'IT/과학': '뉴스',
  국제: '뉴스',
  'K-POP': 'K-POP',
  드라마: '드라마',
  스포츠: '스포츠',
  음식: '음식',
};

function mapAdminArticleToManagedContent(article: AdminArticle): ManagedContent {
  const status: ManagedContent['status'] = article.status === 'PUBLISHED' ? 'published' : 'draft';
  const currentStep: ContentStep =
    status === 'published' ? 'published' : draftStepToContentStep(article.draftStep);

  let dateString = article.updatedAt;
  try {
    const d = new Date(article.updatedAt);
    if (!isNaN(d.getTime())) {
      dateString = d.toISOString().slice(0, 10);
    } else {
      dateString = new Date().toISOString().slice(0, 10);
    }
  } catch {
    dateString = new Date().toISOString().slice(0, 10);
  }

  return {
    id: article.id,
    title: article.titleKo,
    category: categoryMap[article.category.name] ?? '뉴스',
    status,
    currentStep,
    language: 'es',
    views: article.viewCount,
    updatedAt: dateString,
  };
}

export function AdminPipelinePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('admin');

  const sectionQuery = searchParams.get('section');
  const activeAdminSection: AdminSection =
    sectionQuery === 'pipeline' ||
    sectionQuery === 'content-management' ||
    sectionQuery === 'content-edit'
      ? sectionQuery
      : 'home';

  const editingContentId =
    activeAdminSection === 'content-edit' ? searchParams.get('contentId') : null;

  // Pipeline state
  const [savedArticleId, setSavedArticleId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<PipelineStep>('select-article');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [translationTargetLanguage, setTranslationTargetLanguage] =
    useState<TranslationTargetLanguageSelection>('');
  const [hasCompletedContentReview, setHasCompletedContentReview] = useState(false);
  const [hasReviewedTranslation, setHasReviewedTranslation] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // API state
  const [candidateArticles, setCandidateArticles] = useState<AdminCandidateArticle[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [adminArticles, setAdminArticles] = useState<AdminArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const previousStepRef = useRef<PipelineStep>(currentStep);
  const toastTimeoutRef = useRef<number | null>(null);
  const publishReturnTimeoutRef = useRef<number | null>(null);

  const selectedArticle = useMemo(
    () => candidateArticles.find((article) => article.id === selectedArticleId),
    [candidateArticles, selectedArticleId],
  );

  const managedContents = useMemo(
    () => adminArticles.map(mapAdminArticleToManagedContent),
    [adminArticles],
  );

  const previewData = {
    koTitle: translatedContent?.koTitle ?? generatedContent?.title ?? '',
    koBody: translatedContent?.koBody ?? generatedContent?.body ?? '',
    translatedTitle: translatedContent?.esTitle ?? '',
    translatedBody: translatedContent?.esBody ?? '',
  };

  const getCategoryId = useCallback(
    (slug: string) => {
      if (categoriesError) return null;
      return categories.find((c) => c.slug === slug)?.id ?? null;
    },
    [categories, categoriesError],
  );

  async function openDraftContentInPipeline(contentId: string) {
    if (!contentId) return false;

    setIsLoadingDraft(true);
    try {
      const res = await adminApi.getAdminArticle(contentId);
      const article = res.data.data;

      const contentStep = draftStepToContentStep(article.draftStep);
      const nextStep = getPipelineStepFromContentStep(contentStep);

      const source = article.sources[0];
      if (source) {
        const syntheticArticle: AdminCandidateArticle = {
          id: source.url,
          title: source.title,
          summary: '',
          url: source.url,
          thumbnailUrl: article.thumbnailUrl,
          source: source.url,
          category: article.category.name,
          slug: article.category.slug,
          date: article.createdAt,
        };
        setCandidateArticles((prev) => {
          const exists = prev.some((a) => a.id === source.url);
          return exists ? prev : [...prev, syntheticArticle];
        });
        setSelectedArticleId(source.url);
      } else {
        setSelectedArticleId(null);
      }

      setSavedArticleId(contentId);
      setCurrentStep(nextStep);
      setTranslationTargetLanguage(nextStep === 'select-article' ? '' : 'es');
      setHasCompletedContentReview(nextStep === 'review-translation' || nextStep === 'preview');
      setHasReviewedTranslation(nextStep === 'preview');
      setIsPublished(false);
      setSaveStatus('saved');

      if (nextStep !== 'select-article') {
        setGeneratedContent({
          title: article.titleKo,
          body: article.bodyKo ?? '',
          culturalNoteKo: article.culturalNoteKo ?? '',
          category: article.category.name,
        });
      } else {
        setGeneratedContent(null);
      }

      if (nextStep === 'review-translation' || nextStep === 'preview') {
        setTranslatedContent({
          koTitle: article.titleKo,
          koBody: article.bodyKo ?? '',
          culturalNoteKo: article.culturalNoteKo ?? '',
          esTitle: article.titleEs ?? '',
          esBody: article.bodyEs ?? '',
          culturalNoteEs: article.culturalNoteEs ?? '',
        });
      } else {
        setTranslatedContent(null);
      }

      return true;
    } catch (error) {
      console.error('Failed to load draft article:', error);
      showToast({ title: '오류', message: '작업 내용을 불러오지 못했습니다.' });
      return false;
    } finally {
      setIsLoadingDraft(false);
    }
  }

  // Load categories on mount
  useEffect(() => {
    adminApi
      .getCategories()
      .then((res) => setCategories(res.data.data))
      .catch((error) => {
        console.error('Failed to load categories:', error);
        setCategoriesError(true);
        showToast({ title: '오류', message: '카테고리 정보를 불러오지 못했습니다.' });
      });
  }, []);

  // Load candidate articles when pipeline section opens
  useEffect(() => {
    if (activeAdminSection !== 'pipeline') return;
    if (candidateArticles.length > 0) return;

    const load = async () => {
      setIsLoadingCandidates(true);
      try {
        const res = await adminApi.searchNews();
        const mapped: AdminCandidateArticle[] = res.data.data.map((c) => ({
          id: c.url,
          title: c.title,
          summary: c.summary ?? '',
          url: c.url,
          thumbnailUrl: c.thumbnailUrl,
          source: c.source,
          category: c.category,
          slug: c.slug,
          date: c.publishedAt ?? '',
        }));
        setCandidateArticles(mapped);
      } catch (error) {
        console.error('Failed to load candidate articles:', error);
        showToast({ title: '오류', message: '뉴스 기사를 불러오지 못했습니다.' });
      } finally {
        setIsLoadingCandidates(false);
      }
    };
    load();
  }, [activeAdminSection, candidateArticles.length]);

  // Load admin articles when content-management section opens
  useEffect(() => {
    if (activeAdminSection !== 'content-management') return;

    const load = async () => {
      setIsLoadingArticles(true);
      try {
        const res = await adminApi.getAdminArticles({ limit: 50 });
        setAdminArticles(res.data.data.articles);
      } catch (error) {
        console.error('Failed to load admin articles:', error);
        showToast({ title: '오류', message: '관리자 기사를 불러오지 못했습니다.' });
      } finally {
        setIsLoadingArticles(false);
      }
    };
    load();
  }, [activeAdminSection]);

  // Draft hydration on mount
  useEffect(() => {
    let isCancelled = false;

    window.queueMicrotask(() => {
      if (isCancelled) return;

      const urlParams = new URLSearchParams(window.location.search);
      const querySection = urlParams.get('section');
      const contentId = urlParams.get('contentId');

      if (querySection === 'pipeline' && contentId) {
        openDraftContentInPipeline(contentId)
          .then(() => {
            if (!isCancelled) setHasHydratedDraft(true);
          })
          .catch(() => {
            if (!isCancelled) setHasHydratedDraft(true);
          });
        return;
      }

      const sessionDraftStr = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionDraftStr) {
        try {
          const draft = JSON.parse(sessionDraftStr) as Partial<SavedDraft>;
          setSavedArticleId(draft.savedArticleId ?? null);
          setSelectedArticleId(draft.selectedArticleId ?? null);
          setGeneratedContent(draft.generatedContent ?? null);
          setTranslatedContent(draft.translatedContent ?? null);
          setTranslationTargetLanguage(draft.translationTargetLanguage ?? '');
          setHasCompletedContentReview(draft.hasCompletedContentReview ?? false);
          setHasReviewedTranslation(draft.hasReviewedTranslation ?? false);
          setIsPublished(draft.isPublished ?? false);
          setCurrentStep(draft.currentStep ?? 'select-article');
          previousStepRef.current = draft.currentStep ?? 'select-article';
          setSaveStatus(draft.saved ? 'saved' : 'dirty');
          setHasHydratedDraft(true);
          return;
        } catch {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }

      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) {
        setHasHydratedDraft(true);
        return;
      }

      try {
        const draft = JSON.parse(savedDraft) as Partial<SavedDraft>;
        if (draft.saved !== true) {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
          setHasHydratedDraft(true);
          return;
        }

        setSavedArticleId(draft.savedArticleId ?? null);
        setSelectedArticleId(draft.selectedArticleId ?? null);
        setGeneratedContent(draft.generatedContent ?? null);
        setTranslatedContent(draft.translatedContent ?? null);
        setTranslationTargetLanguage(draft.translationTargetLanguage ?? '');
        setHasCompletedContentReview(
          draft.hasCompletedContentReview ??
            (draft.currentStep === 'review-translation' || draft.currentStep === 'preview'),
        );
        setHasReviewedTranslation(draft.hasReviewedTranslation ?? draft.currentStep === 'preview');
        setIsPublished(draft.isPublished ?? false);
        setCurrentStep(draft.currentStep ?? 'select-article');
        previousStepRef.current = draft.currentStep ?? 'select-article';
        setSaveStatus('saved');
      } catch {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } finally {
        setHasHydratedDraft(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedDraft) return;
    if (previousStepRef.current === currentStep) return;

    previousStepRef.current = currentStep;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentStep, hasHydratedDraft]);

  useEffect(() => {
    if (!hasHydratedDraft) return;

    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        savedArticleId,
        currentStep,
        selectedArticleId,
        generatedContent,
        translatedContent,
        translationTargetLanguage,
        hasCompletedContentReview,
        hasReviewedTranslation,
        isPublished,
        saved: saveStatus === 'saved',
      }),
    );
  }, [
    hasHydratedDraft,
    savedArticleId,
    currentStep,
    selectedArticleId,
    generatedContent,
    translatedContent,
    translationTargetLanguage,
    hasCompletedContentReview,
    hasReviewedTranslation,
    isPublished,
    saveStatus,
  ]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      if (publishReturnTimeoutRef.current) {
        window.clearTimeout(publishReturnTimeoutRef.current);
      }
    };
  }, []);

  function showToast(nextToast: Exclude<ToastState, null>) {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast(nextToast);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  }

  function handleSelectArticle(articleId: string) {
    if (selectedArticleId === articleId) {
      setSelectedArticleId(null);
      return;
    }

    setSelectedArticleId(articleId);
    setGeneratedContent(null);
    setTranslatedContent(null);
    setTranslationTargetLanguage('');
    setHasCompletedContentReview(false);
    setHasReviewedTranslation(false);
    setIsPublished(false);
    setSavedArticleId(null);
    setSaveStatus('idle');
  }

  async function handleGenerateContent() {
    if (!selectedArticle) return;

    setIsGenerating(true);
    try {
      const res = await adminApi.generateContent({
        mode: 'generate',
        title: selectedArticle.title,
        content: selectedArticle.summary,
      });
      const { titleKo, bodyKo, culturalNoteKo } = res.data.data;
      setGeneratedContent({
        title: titleKo,
        body: bodyKo,
        culturalNoteKo,
        category: selectedArticle.category,
      });
      setTranslatedContent(null);
      setTranslationTargetLanguage('');
      setHasCompletedContentReview(false);
      setHasReviewedTranslation(false);
      setIsPublished(false);
      setCurrentStep('review-content');
      setSaveStatus('dirty');
    } catch {
      showToast({ title: '오류', message: 'AI 콘텐츠 생성에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleNextFromContent() {
    if (!generatedContent || !translationTargetLanguage) return;

    setIsTranslating(true);
    try {
      const res = await adminApi.translateContent({
        mode: 'translate',
        titleKo: generatedContent.title,
        bodyKo: generatedContent.body,
        culturalNoteKo: generatedContent.culturalNoteKo,
      });
      const { titleEs, bodyEs, culturalNoteEs } = res.data.data;
      setTranslatedContent((current) => ({
        koTitle: generatedContent.title,
        koBody: generatedContent.body,
        culturalNoteKo: generatedContent.culturalNoteKo,
        esTitle: current?.esTitle ?? titleEs,
        esBody: current?.esBody ?? bodyEs,
        culturalNoteEs: current?.culturalNoteEs ?? culturalNoteEs,
      }));
      setHasCompletedContentReview(true);
      setHasReviewedTranslation(false);
      setCurrentStep('review-translation');
      setSaveStatus('dirty');
    } catch {
      showToast({ title: '오류', message: 'AI 번역에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsTranslating(false);
    }
  }

  function handleTranslationTargetLanguageChange(language: TranslationTargetLanguageSelection) {
    setTranslationTargetLanguage(language);
    setHasCompletedContentReview(false);
    setHasReviewedTranslation(false);
    setSaveStatus('dirty');
  }

  function handleNextFromTranslation() {
    if (!translatedContent) return;
    if (!translatedContent.esTitle.trim() || !getTextFromRichTextHtml(translatedContent.esBody)) {
      return;
    }
    setHasReviewedTranslation(true);
    setCurrentStep('preview');
    setSaveStatus('dirty');
  }

  function handlePrev() {
    if (currentStep === 'review-content') {
      setCurrentStep('select-article');
      return;
    }
    if (currentStep === 'review-translation') {
      setCurrentStep('review-content');
      return;
    }
    if (currentStep === 'preview') {
      setCurrentStep('review-translation');
    }
  }

  function canNavigateToStep(step: PipelineStep) {
    if (step === 'select-article') return true;
    if (step === 'review-content') return Boolean(generatedContent);
    if (step === 'review-translation')
      return Boolean(translatedContent && hasCompletedContentReview);
    if (step === 'preview') return Boolean(translatedContent && hasReviewedTranslation);
    return false;
  }

  function handleStepChange(step: PipelineStep) {
    if (!canNavigateToStep(step)) return;
    setCurrentStep(step);
  }

  async function persistArticle(params: {
    draftStep: 'select' | 'review_ko' | 'review_es' | 'preview';
    langStatusKo: 'pending' | 'done';
    langStatusEs: 'pending' | 'done';
  }) {
    let articleId = savedArticleId;
    const categoryId = selectedArticle ? (getCategoryId(selectedArticle.category) ?? 1) : 1;

    if (!articleId) {
      const res = await adminApi.createDraftArticle({
        titleKo: generatedContent?.title ?? selectedArticle?.title ?? '',
        bodyKo: generatedContent?.body ?? selectedArticle?.summary ?? selectedArticle?.title ?? '',
        culturalNoteKo: generatedContent?.culturalNoteKo,
        titleEs: translatedContent?.esTitle,
        bodyEs: translatedContent?.esBody,
        culturalNoteEs: translatedContent?.culturalNoteEs,
        thumbnailUrl: selectedArticle?.thumbnailUrl ?? undefined,
        categoryId,
        sourceUrl: selectedArticle?.url ?? '',
        sourceTitle: selectedArticle?.title,
        ...params,
      });
      articleId = res.data.data.id;
      setSavedArticleId(articleId);
    } else {
      await adminApi.updateArticle(articleId, {
        titleKo: generatedContent?.title,
        bodyKo: generatedContent?.body,
        culturalNoteKo: generatedContent?.culturalNoteKo,
        titleEs: translatedContent?.esTitle,
        bodyEs: translatedContent?.esBody,
        culturalNoteEs: translatedContent?.culturalNoteEs,
        ...params,
      });
    }
    return articleId;
  }

  async function handleSaveDraft() {
    if (isSavingDraft) return;

    if (!generatedContent && !selectedArticle) {
      showToast({ title: '알림', message: '기사를 먼저 선택해주세요.' });
      return;
    }

    setIsSavingDraft(true);
    try {
      const draftStep = pipelineStepToDraftStep(currentStep);
      const langStatusKo: 'pending' | 'done' =
        hasCompletedContentReview || currentStep === 'preview' ? 'done' : 'pending';
      const langStatusEs: 'pending' | 'done' = hasReviewedTranslation ? 'done' : 'pending';

      const articleId = await persistArticle({ draftStep, langStatusKo, langStatusEs });

      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          savedArticleId: articleId,
          currentStep,
          selectedArticleId,
          generatedContent,
          translatedContent,
          translationTargetLanguage,
          hasCompletedContentReview,
          hasReviewedTranslation,
          isPublished,
          saved: true,
        }),
      );
      setSaveStatus('saved');
      showToast({ title: '임시저장 완료', message: '현재 파이프라인 작업이 저장되었습니다.' });
      sessionStorage.setItem('coreahoy-content-management-tab', 'draft');
      openContentManagement();
    } catch {
      showToast({ title: '오류', message: '임시저장에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function handlePublish() {
    if (isPublishing) return;

    if (!translatedContent?.esTitle?.trim() || !getTextFromRichTextHtml(translatedContent.esBody)) {
      return;
    }
    if (!generatedContent) return;

    setIsPublishing(true);
    try {
      const articleId = await persistArticle({
        draftStep: 'preview',
        langStatusKo: 'done',
        langStatusEs: 'done',
      });

      await adminApi.publishArticle(articleId);

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      setIsPublished(true);
      setSaveStatus('saved');
      setSavedArticleId(null);
      setSelectedArticleId(null);
      showToast({ title: '발행 완료', message: '콘텐츠가 발행 처리되었습니다.' });

      publishReturnTimeoutRef.current = window.setTimeout(() => {
        goHome();
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, PUBLISH_RETURN_DELAY_MS);
    } catch {
      showToast({ title: '오류', message: '발행에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsPublishing(false);
    }
  }

  function handleGeneratedContentChange(content: GeneratedContent) {
    setGeneratedContent(content);
    setHasCompletedContentReview(false);
    setHasReviewedTranslation(false);
    setSaveStatus('dirty');
  }

  function handleTranslatedContentChange(content: TranslatedContent) {
    setTranslatedContent(content);
    setHasReviewedTranslation(false);
    setSaveStatus('dirty');
  }

  function openPipeline() {
    setCurrentStep('select-article');
    setSelectedArticleId(null);
    setGeneratedContent(null);
    setTranslatedContent(null);
    setTranslationTargetLanguage('');
    setHasCompletedContentReview(false);
    setHasReviewedTranslation(false);
    setIsPublished(false);
    setSavedArticleId(null);
    setSaveStatus('idle');
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    const params = new URLSearchParams(searchParams.toString());
    params.set('section', 'pipeline');
    params.delete('contentId');
    params.delete('step');
    router.push(`${pathname}?${params.toString()}`);
  }

  function openContentManagement() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('section', 'content-management');
    params.delete('contentId');
    params.delete('step');
    router.push(`${pathname}?${params.toString()}`);
  }

  function openContentEdit(contentId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('section', 'content-edit');
    params.set('contentId', contentId);
    params.delete('step');
    router.push(`${pathname}?${params.toString()}`);
  }

  async function handleSaveEdit(data: EditFormData) {
    if (isEditSaving || !editingContentId) return;
    setIsEditSaving(true);
    try {
      await adminApi.updateArticle(editingContentId, {
        titleKo: data.titleKo,
        bodyKo: data.bodyKo,
        titleEs: data.titleEs,
        bodyEs: data.bodyEs,
      });
      setAdminArticles((prev) =>
        prev.map((a) =>
          a.id === editingContentId ? { ...a, titleKo: data.titleKo, titleEs: data.titleEs } : a,
        ),
      );
      showToast({ title: '수정 완료', message: '콘텐츠가 성공적으로 수정되었습니다.' });
      openContentManagement();
    } catch {
      showToast({ title: '오류', message: '수정에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsEditSaving(false);
    }
  }

  function goHome() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('section');
    params.delete('contentId');
    params.delete('step');
    router.push(`${pathname}?${params.toString()}`);
  }

  async function handleDeleteContent(contentId: string) {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await adminApi.deleteArticle(contentId);
      setAdminArticles((prev) => prev.filter((a) => a.id !== contentId));
    } catch (error) {
      console.error('Failed to delete content:', error);
      showToast({ title: '오류', message: '삭제에 실패했습니다.' });
    }
  }

  if (!hasHydratedDraft) {
    return (
      <div className="py-6 pb-10 md:py-10">
        <header className="mb-7">
          <h1 className="mb-1 text-3xl font-black text-black">{t('title')}</h1>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div key={item} className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pb-10 md:py-10">
      <header className="mb-7">
        <h1 className="mb-1 text-3xl font-black text-black">{t('title')}</h1>
        <p className="text-sm font-medium text-gray-400">{t('pipelineSubtitle')}</p>
      </header>

      {activeAdminSection !== 'home' && (
        <div className="mb-8 border-b border-gray-100 pb-4">
          <button
            type="button"
            onClick={goHome}
            className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 transition-colors cursor-pointer hover:border-black hover:text-black"
          >
            {t('homeButton')}
          </button>
        </div>
      )}

      {activeAdminSection === 'home' && (
        <section className="flex flex-col gap-3 sm:flex-row" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={false}
            onClick={openPipeline}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-gray-700 transition-colors cursor-pointer hover:border-black hover:text-black sm:min-w-40"
          >
            {t('tabCreate')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={false}
            onClick={openContentManagement}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-gray-700 transition-colors cursor-pointer hover:border-black hover:text-black sm:min-w-40"
          >
            {t('tabList')}
          </button>
        </section>
      )}

      {activeAdminSection === 'pipeline' && isLoadingDraft && (
        <div className="animate-fade-in flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {activeAdminSection === 'pipeline' && !isLoadingDraft && (
        <PipelineSteps
          currentStep={currentStep}
          canNavigateToStep={canNavigateToStep}
          onStepChange={handleStepChange}
        />
      )}

      {activeAdminSection === 'pipeline' && !isLoadingDraft && currentStep === 'select-article' && (
        <section className="animate-fade-in lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          <div className="flex flex-col gap-3">
            {isLoadingCandidates ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
              ))
            ) : candidateArticles.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm font-bold text-gray-400">
                {t('noArticles')}
              </div>
            ) : (
              candidateArticles.map((article) => (
                <ArticleSelectCard
                  key={article.id}
                  article={article}
                  isSelected={article.id === selectedArticleId}
                  onSelect={handleSelectArticle}
                />
              ))
            )}
          </div>

          <WorkflowControlPanel
            hasSelectedArticle={Boolean(selectedArticle)}
            isGenerating={isGenerating}
            onGenerate={handleGenerateContent}
          />
        </section>
      )}

      {activeAdminSection === 'pipeline' &&
        !isLoadingDraft &&
        currentStep === 'review-content' &&
        selectedArticle &&
        generatedContent && (
          <ContentReviewStep
            article={selectedArticle}
            content={generatedContent}
            targetLanguage={translationTargetLanguage}
            onTargetLanguageChange={handleTranslationTargetLanguageChange}
            onChange={handleGeneratedContentChange}
            onSaveDraft={handleSaveDraft}
            saveStatus={saveStatus}
            isTranslating={isTranslating}
            onNext={handleNextFromContent}
            onPrev={handlePrev}
          />
        )}

      {activeAdminSection === 'pipeline' &&
        !isLoadingDraft &&
        currentStep === 'review-translation' &&
        translatedContent && (
          <TranslationReviewStep
            content={translatedContent}
            onChange={handleTranslatedContentChange}
            onSaveDraft={handleSaveDraft}
            saveStatus={saveStatus}
            onNext={handleNextFromTranslation}
            onPrev={handlePrev}
          />
        )}

      {activeAdminSection === 'pipeline' && !isLoadingDraft && currentStep === 'preview' && (
        <PreviewPublishStep
          previewData={previewData}
          isPublished={isPublished}
          onSaveDraft={handleSaveDraft}
          saveStatus={saveStatus}
          onPublish={handlePublish}
          onPrev={handlePrev}
        />
      )}

      {activeAdminSection === 'content-management' && (
        <ContentManagementPage
          contents={managedContents}
          isLoading={isLoadingArticles}
          onDeleteContent={handleDeleteContent}
          onEditPublished={openContentEdit}
          onContinueDraft={(contentId) => {
            openDraftContentInPipeline(contentId);
            const params = new URLSearchParams(searchParams.toString());
            params.set('section', 'pipeline');
            params.set('contentId', contentId);
            params.delete('step');
            router.push(`${pathname}?${params.toString()}`);
          }}
        />
      )}

      {activeAdminSection === 'content-edit' &&
        (editingContentId ? (
          <ContentEditStep
            articleId={editingContentId}
            isSaving={isEditSaving}
            onSave={handleSaveEdit}
            onCancel={openContentManagement}
          />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              {t('selectContentToEdit') ?? '수정할 콘텐츠를 선택해주세요.'}
            </p>
            <button
              type="button"
              onClick={openContentManagement}
              className="mt-4 rounded-xl bg-black px-6 py-3 text-sm font-black text-white transition-opacity hover:opacity-80"
            >
              {t('tabList')}
            </button>
          </div>
        ))}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 z-[80] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl sm:top-24"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/images/characters/mascot-cheer.png"
              alt=""
              width={52}
              height={46}
              className="h-12 w-14 flex-shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="text-sm font-black text-black">{toast.title}</p>
              <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
