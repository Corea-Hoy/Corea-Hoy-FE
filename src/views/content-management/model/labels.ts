import { CATEGORIES_KO } from '@/entities/content';
import type { ContentCategory, ContentLanguage, ContentStatus, ContentStep } from './types';

export const CATEGORY_OPTIONS = CATEGORIES_KO.filter(
  (category): category is ContentCategory => category !== '전체',
);

export const STEP_OPTIONS: ContentStep[] = [
  'select_article',
  'review_content',
  'review_translation',
  'preview',
];

export const STEP_LABELS: Record<ContentStep, string> = {
  select_article: '기사 선택',
  review_content: '콘텐츠 검수',
  review_translation: '번역 검수',
  preview: '미리보기',
  published: '발행 완료',
};

export const STEP_STYLES: Record<ContentStep, string> = {
  select_article: 'bg-gray-100 text-gray-600',
  review_content: 'bg-sky-50 text-sky-700',
  review_translation: 'bg-indigo-50 text-indigo-700',
  preview: 'bg-amber-50 text-amber-700',
  published: 'bg-green-50 text-green-700',
};

export const STATUS_LABELS: Record<ContentStatus, string> = {
  published: '발행됨',
  draft: '임시저장',
};

export const STATUS_STYLES: Record<ContentStatus, string> = {
  published: 'bg-green-50 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
};

export const LANGUAGE_LABELS: Record<ContentLanguage, string> = {
  ko: 'KO',
  es: 'ES',
};
