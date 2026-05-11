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
import type { ContentStep } from '@/views/content-management/model/types';
import { getTextFromRichTextHtml } from '@/shared/ui/rich-text-editor/getTextFromRichTextHtml';
import { ArticleSelectCard } from './ArticleSelectCard';
import { ContentReviewStep } from './ContentReviewStep';
import { PipelineSteps } from './PipelineSteps';
import { PreviewPublishStep } from './PreviewPublishStep';
import { TranslationReviewStep } from './TranslationReviewStep';
import { WorkflowControlPanel } from './WorkflowControlPanel';
import { adminApi, type AdminArticle, type DbCategory } from '@/features/admin/api/admin.api';
import type { ManagedContent } from '@/views/content-management/model/types';

const DRAFT_STORAGE_KEY = 'coreahoy-admin-pipeline-draft';
const SESSION_STORAGE_KEY = 'coreahoy-admin-pipeline-session';
const PUBLISH_RETURN_DELAY_MS = 2000;

type AdminSection = 'home' | 'pipeline' | 'content-management';
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
  if (draftStep === 'review-ko') return 'review_content';
  if (draftStep === 'review-es') return 'review_translation';
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
): 'select' | 'review-ko' | 'review-es' | 'preview' {
  if (step === 'select-article') return 'select';
  if (step === 'review-content') return 'review-ko';
  if (step === 'review-translation') return 'review-es';
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

  const sectionQuery = searchParams.get('section');
  const activeAdminSection: AdminSection =
    sectionQuery === 'pipeline' || sectionQuery === 'content-management' ? sectionQuery : 'home';

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
  const [newsError, setNewsError] = useState(false);
  const [articlesError, setArticlesError] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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

  function openDraftContentInPipeline(
    contentId: string | null,
    contentStep: ContentStep | null,
    article?: AdminArticle,
  ) {
    if (!contentId || !contentStep) return false;

    const nextStep = getPipelineStepFromContentStep(contentStep);

    setSavedArticleId(contentId);
    setCurrentStep(nextStep);
    setSelectedArticleId(null);
    setGeneratedContent(null);
    setTranslatedContent(null);
    setTranslationTargetLanguage(nextStep === 'select-article' ? '' : 'es');
    setHasCompletedContentReview(nextStep === 'review-translation' || nextStep === 'preview');
    setHasReviewedTranslation(nextStep === 'preview');
    setIsPublished(false);
    setSaveStatus('saved');

    if (article && nextStep !== 'select-article') {
      const genContent: GeneratedContent = {
        title: article.titleKo,
        body: '',
        culturalNoteKo: '',
        category: article.category.name,
      };
      setGeneratedContent(genContent);

      if (nextStep === 'review-translation' || nextStep === 'preview') {
        setTranslatedContent({
          koTitle: article.titleKo,
          koBody: '',
          culturalNoteKo: '',
          esTitle: article.titleEs ?? '',
          esBody: '',
          culturalNoteEs: '',
        });
      }
    }

    return true;
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
        setNewsError(true);
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
        setArticlesError(true);
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
      const rawContentStep = urlParams.get('step');
      const validSteps: ContentStep[] = [
        'select_article',
        'review_content',
        'review_translation',
        'preview',
      ];
      const contentStep = validSteps.includes(rawContentStep as ContentStep)
        ? (rawContentStep as ContentStep)
        : null;

      if (querySection === 'pipeline' && contentId && contentStep) {
        openDraftContentInPipeline(contentId, contentStep);
        setHasHydratedDraft(true);
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
    draftStep: 'select' | 'review-ko' | 'review-es' | 'preview';
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
          <h1 className="mb-1 text-3xl font-black text-black">관리자 콘솔</h1>
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
        <h1 className="mb-1 text-3xl font-black text-black">관리자 콘솔</h1>
        <p className="text-sm font-medium text-gray-400">콘텐츠 생성 파이프라인을 시작하세요.</p>
      </header>

      {activeAdminSection !== 'home' && (
        <div className="mb-8 border-b border-gray-100 pb-4">
          <button
            type="button"
            onClick={goHome}
            className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 transition-colors cursor-pointer hover:border-black hover:text-black"
          >
            관리자 홈
          </button>
        </div>
      )}

      {activeAdminSection === 'home' && (
        <section
          className="flex flex-col gap-3 sm:flex-row"
          role="tablist"
          aria-label="관리자 화면 선택"
        >
          <button
            type="button"
            role="tab"
            aria-selected={false}
            onClick={openPipeline}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-gray-700 transition-colors cursor-pointer hover:border-black hover:text-black sm:min-w-40"
          >
            파이프라인 실행
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={false}
            onClick={openContentManagement}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-gray-700 transition-colors cursor-pointer hover:border-black hover:text-black sm:min-w-40"
          >
            콘텐츠 관리
          </button>
        </section>
      )}

      {activeAdminSection === 'pipeline' && (
        <PipelineSteps
          currentStep={currentStep}
          canNavigateToStep={canNavigateToStep}
          onStepChange={handleStepChange}
        />
      )}

      {activeAdminSection === 'pipeline' && currentStep === 'select-article' && (
        <section className="animate-fade-in lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          <div className="flex flex-col gap-3">
            {isLoadingCandidates ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
              ))
            ) : candidateArticles.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm font-bold text-gray-400">
                수집된 기사가 없습니다.
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
            onSaveDraft={handleSaveDraft}
            saveStatus={saveStatus}
          />
        </section>
      )}

      {activeAdminSection === 'pipeline' &&
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

      {activeAdminSection === 'pipeline' && currentStep === 'preview' && (
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
          onContinueDraft={(contentId, contentStep) => {
            const article = adminArticles.find((a) => a.id === contentId);
            openDraftContentInPipeline(contentId, contentStep, article);

            const params = new URLSearchParams(searchParams.toString());
            params.set('section', 'pipeline');
            params.set('contentId', contentId);
            params.set('step', contentStep);
            router.push(`${pathname}?${params.toString()}`);
          }}
        />
      )}

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
