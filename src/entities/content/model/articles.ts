export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ArticleCount {
  likes: number;
  comments: number;
}

export interface Article {
  id: string;
  titleKo: string;
  titleEs: string;
  thumbnailUrl: string;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  category: ArticleCategory;
  _count: ArticleCount;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetArticlesResponse {
  success: boolean;
  data: {
    articles: Article[];
    pagination: Pagination;
  };
}
