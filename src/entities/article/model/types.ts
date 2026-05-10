export type ArticleRequest = {
  id: string;
  titleKo: string;
  bodyKo: string;
  culturalNoteKo: string;
  bodyEs: string;
  culturalNoteEs: string;
  thumbnailUrl: string;
  status: string;
  draftStep: string;
  langStatusKo: string;
  langStatusEs: string;
  viewCount: number;
  categoryId: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  sources: Sources[];
  _count: Count;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Sources = {
  id: number;
  articleId: string;
  title: string;
  url: string;
};

type Count = {
  likes: number;
  comments: number;
};

export type UpdateArticleRequest = {
  titleKo: string;
  bodyKo: string;
  culturalNoteKo: string;
  titleEs: string;
  bodyEs: string;
  culturalNoteEs: string;
  draftStep: string;
  langStatusKo: string;
  langStatusEs: string;
};
