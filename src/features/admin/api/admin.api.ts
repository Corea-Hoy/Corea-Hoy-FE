import api from '@/shared/api';

export interface NewsCandidate {
  title: string;
  summary?: string;
  url: string;
  thumbnailUrl: string | null;
  source: string;
  category: string;
  slug: string;
  publishedAt?: string;
}

export interface GenerateResult {
  titleKo: string;
  bodyKo: string;
  culturalNoteKo: string;
}

export interface TranslateResult {
  titleEs: string;
  bodyEs: string;
  culturalNoteEs: string;
}

export interface AdminArticle {
  id: string;
  titleKo: string;
  titleEs: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  draftStep: 'select' | 'review_ko' | 'review_es' | 'preview';
  langStatusKo: 'pending' | 'done';
  langStatusEs: 'pending' | 'done';
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: number; name: string; slug: string };
  _count: { likes: number; comments: number };
}

export interface AdminArticlesResponse {
  articles: AdminArticle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DbCategory {
  id: number;
  name: string;
  slug: string;
}

export const adminApi = {
  searchNews: () =>
    api.post<{ success: boolean; data: NewsCandidate[] }>('/api/admin/pipeline/search'),

  generateContent: (data: { mode: 'generate'; title: string; content: string }) =>
    api.post<{ success: boolean; data: GenerateResult }>('/api/admin/pipeline/generate', data),

  translateContent: (data: { mode: 'translate'; titleKo: string; bodyKo: string }) =>
    api.post<{ success: boolean; data: TranslateResult }>('/api/admin/pipeline/generate', data),

  getAdminArticles: (params?: {
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    page?: number;
    limit?: number;
  }) =>
    api.get<{ success: boolean; data: AdminArticlesResponse }>('/api/admin/articles', { params }),

  createDraftArticle: (data: {
    titleKo: string;
    bodyKo: string;
    culturalNoteKo?: string;
    titleEs?: string;
    bodyEs?: string;
    culturalNoteEs?: string;
    thumbnailUrl?: string;
    categoryId: number;
    sourceUrl: string;
    sourceTitle?: string;
    draftStep?: 'select' | 'review-ko' | 'review-es' | 'preview';
    langStatusKo?: 'pending' | 'done';
    langStatusEs?: 'pending' | 'done';
  }) => api.post<{ success: boolean; data: AdminArticle }>('/api/admin/articles', data),

  updateArticle: (
    id: string,
    data: {
      titleKo?: string;
      bodyKo?: string;
      culturalNoteKo?: string;
      titleEs?: string;
      bodyEs?: string;
      culturalNoteEs?: string;
      draftStep?: 'select' | 'review-ko' | 'review-es' | 'preview';
      langStatusKo?: 'pending' | 'done';
      langStatusEs?: 'pending' | 'done';
    },
  ) => api.put<{ success: boolean; data: AdminArticle }>(`/api/admin/articles/${id}`, data),

  publishArticle: (id: string) =>
    api.patch<{ success: boolean; data: AdminArticle }>(`/api/admin/articles/${id}/publish`),

  deleteArticle: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/articles/${id}`),

  getCategories: () => api.get<{ success: boolean; data: DbCategory[] }>('/api/categories'),
};
