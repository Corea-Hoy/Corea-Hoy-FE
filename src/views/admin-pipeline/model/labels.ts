import type { PipelineStep, TranslationTargetLanguage } from './types';

export const PIPELINE_STEPS: { id: PipelineStep; number: number; label: string }[] = [
  { id: 'select-article', number: 1, label: '기사 선택' },
  { id: 'review-content', number: 2, label: '콘텐츠 검수' },
  { id: 'review-translation', number: 3, label: '번역 검수' },
  { id: 'preview', number: 4, label: '미리보기' },
];

export const TRANSLATION_TARGET_LANGUAGES: { code: TranslationTargetLanguage; label: string }[] = [
  { code: 'es', label: '스페인어' },
];
