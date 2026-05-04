import type { CategoryFilter } from '@/entities/content';

export type ContentCategory = Exclude<CategoryFilter, '전체'>;

export type ContentStatus = 'published' | 'draft';

export type ContentLanguage = 'ko' | 'es';

export type ContentStep =
  | 'select_article'
  | 'review_content'
  | 'review_translation'
  | 'preview'
  | 'published';

export interface ManagedContent {
  id: string;
  title: string;
  category: ContentCategory;
  status: ContentStatus;
  currentStep: ContentStep;
  language: ContentLanguage;
  views: number;
  updatedAt: string;
}
