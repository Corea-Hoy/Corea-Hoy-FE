export interface AdminCandidateArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  thumbnailUrl: string | null;
  source: string;
  category: string;
  slug: string;
  date: string;
}

export type PipelineStep = 'select-article' | 'review-content' | 'review-translation' | 'preview';

export interface GeneratedContent {
  title: string;
  category: string;
  body: string;
  culturalNoteKo: string;
}

export interface TranslatedContent {
  koTitle: string;
  koBody: string;
  culturalNoteKo: string;
  esTitle: string;
  esBody: string;
  culturalNoteEs: string;
}

export type TranslationTargetLanguage = 'es';
export type TranslationTargetLanguageSelection = TranslationTargetLanguage | '';
