'use client';

import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createMockGeneratedContent,
  createMockTranslatedContent,
  MOCK_ADMIN_ARTICLES,
  type GeneratedContent,
  type PipelineStep,
  type TranslatedContent,
  type TranslationTargetLanguageSelection,
} from '../model/mockArticles';
import {
  ContentManagementPage,
  MOCK_MANAGED_CONTENTS,
  type ContentStep,
} from '@/views/content-management';
import { ArticleSelectCard } from './ArticleSelectCard';
import { ContentReviewStep } from './ContentReviewStep';
import { PipelineSteps } from './PipelineSteps';
import { PreviewPublishStep } from './PreviewPublishStep';
import { TranslationReviewStep } from './TranslationReviewStep';
import { WorkflowControlPanel } from './WorkflowControlPanel';

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

function getPipelineStepFromContentStep(step: ContentStep): PipelineStep {
  if (step === 'select_article') return 'select-article';
  if (step === 'review_content') return 'review-content';
  if (step === 'review_translation') return 'review-translation';
  return 'preview';
}

function getContentStepFromQuery(step: string | null): ContentStep | null {
  if (
    step === 'select_article' ||
    step === 'review_content' ||
    step === 'review_translation' ||
    step === 'preview'
  ) {
    return step;
  }

  return null;
}

export function AdminPipelinePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sectionQuery = searchParams.get('section');
  const activeAdminSection: AdminSection =
    sectionQuery === 'pipeline' || sectionQuery === 'content-management' ? sectionQuery : 'home';
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
  const previousStepRef = useRef<PipelineStep>(currentStep);
  const toastTimeoutRef = useRef<number | null>(null);
  const publishReturnTimeoutRef = useRef<number | null>(null);

  const selectedArticle = useMemo(
    () => MOCK_ADMIN_ARTICLES.find((article) => article.id === selectedArticleId),
    [selectedArticleId],
  );

  const previewData = {
    koTitle: translatedContent?.koTitle ?? generatedContent?.title ?? '',
    koBody: translatedContent?.koBody ?? generatedContent?.body ?? '',
    translatedTitle: translatedContent?.esTitle ?? '',
    translatedBody: translatedContent?.esBody ?? '',
    category: generatedContent?.category ?? '문화',
  };

  function openDraftContentInPipeline(contentId: string | null, contentStep: ContentStep | null) {
    const draftContent = MOCK_MANAGED_CONTENTS.find((content) => content.id === contentId);
    if (!draftContent || !contentStep) return false;

    const fallbackArticle = MOCK_ADMIN_ARTICLES[0];
    const nextStep = getPipelineStepFromContentStep(contentStep);
    const nextGeneratedContent: GeneratedContent = {
      title: draftContent.title,
      category: draftContent.category,
      body: `${draftContent.title}

이 콘텐츠는 콘텐츠 관리에서 이어서 작업 중인 임시저장 항목입니다.
백엔드 연동 시 draft id를 기준으로 저장된 본문과 검수 상태를 불러오도록 교체합니다.`,
    };
    const nextTranslatedContent = createMockTranslatedContent(nextGeneratedContent, 'es');

    setCurrentStep(nextStep);
    setSelectedArticleId(fallbackArticle.id);
    setGeneratedContent(nextStep === 'select-article' ? null : nextGeneratedContent);
    setTranslatedContent(
      nextStep === 'review-translation' || nextStep === 'preview' ? nextTranslatedContent : null,
    );
    setTranslationTargetLanguage(nextStep === 'select-article' ? '' : 'es');
    setHasCompletedContentReview(nextStep === 'review-translation' || nextStep === 'preview');
    setHasReviewedTranslation(nextStep === 'preview');
    setIsPublished(false);
    setSaveStatus('saved');

    return true;
  }

  useEffect(() => {
    let isCancelled = false;

    window.queueMicrotask(() => {
      if (isCancelled) return;

      const urlParams = new URLSearchParams(window.location.search);
      const querySection = urlParams.get('section');
      const contentId = urlParams.get('contentId');
      const contentStep = getContentStepFromQuery(urlParams.get('step'));

      if (querySection === 'pipeline' && openDraftContentInPipeline(contentId, contentStep)) {
        setHasHydratedDraft(true);
        return;
      }

      const sessionDraftStr = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionDraftStr) {
        try {
          const draft = JSON.parse(sessionDraftStr) as Partial<SavedDraft>;
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
    setSaveStatus('idle');
  }

  function handleGenerateContent() {
    if (!selectedArticle) return;
    setGeneratedContent(createMockGeneratedContent(selectedArticle));
    setTranslatedContent(null);
    setTranslationTargetLanguage('');
    setHasCompletedContentReview(false);
    setHasReviewedTranslation(false);
    setIsPublished(false);
    setCurrentStep('review-content');
    setSaveStatus('dirty');
  }

  function handleNextFromContent() {
    if (!generatedContent || !translationTargetLanguage) return;
    setTranslatedContent((current) => {
      const nextTranslation = createMockTranslatedContent(
        generatedContent,
        translationTargetLanguage,
      );
      if (!current) return nextTranslation;
      return {
        ...nextTranslation,
        esTitle: current.esTitle,
        esBody: current.esBody,
      };
    });
    setHasCompletedContentReview(true);
    setHasReviewedTranslation(false);
    setCurrentStep('review-translation');
    setSaveStatus('dirty');
  }

  function handleTranslationTargetLanguageChange(language: TranslationTargetLanguageSelection) {
    setTranslationTargetLanguage(language);
    setHasCompletedContentReview(false);
    setHasReviewedTranslation(false);
    setSaveStatus('dirty');
    if (!generatedContent || !language) {
      setTranslatedContent(null);
      return;
    }
    setTranslatedContent(createMockTranslatedContent(generatedContent, language));
  }

  function handleNextFromTranslation() {
    if (!translatedContent) return;
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
    if (step === 'review-content') return Boolean(selectedArticle && generatedContent);
    if (step === 'review-translation')
      return Boolean(translatedContent && hasCompletedContentReview);
    if (step === 'preview') return Boolean(translatedContent && hasReviewedTranslation);
    return false;
  }

  function handleStepChange(step: PipelineStep) {
    if (!canNavigateToStep(step)) return;
    setCurrentStep(step);
  }

  function handlePublish() {
    if (!generatedContent?.category) return;

    setIsPublished(true);
    setSaveStatus('dirty');
    showToast({
      title: '발행 완료',
      message: '콘텐츠가 발행 처리되었습니다.',
    });

    publishReturnTimeoutRef.current = window.setTimeout(() => {
      goHome();
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, PUBLISH_RETURN_DELAY_MS);
  }

  function handleSaveDraft() {
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
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
    showToast({
      title: '임시저장 완료',
      message: '현재 파이프라인 작업이 저장되었습니다.',
    });
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
            {MOCK_ADMIN_ARTICLES.map((article) => (
              <ArticleSelectCard
                key={article.id}
                article={article}
                isSelected={article.id === selectedArticleId}
                onSelect={handleSelectArticle}
              />
            ))}
          </div>

          <WorkflowControlPanel
            hasSelectedArticle={Boolean(selectedArticle)}
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
          onContinueDraft={(contentId, contentStep) => {
            openDraftContentInPipeline(contentId, contentStep);

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
