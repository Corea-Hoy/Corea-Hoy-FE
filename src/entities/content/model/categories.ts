// Shared category constants — single source of truth for Nav, page, ContentCard

export const CATEGORIES_KO = ['전체', 'K-POP', '드라마', '뉴스', '문화', '스포츠', '음식'] as const;
export const CATEGORIES_ES = [
  'Todos',
  'K-POP',
  'Drama',
  'Noticias',
  'Cultura',
  'Deportes',
  'Comida',
] as const;

export type CategoryFilter = (typeof CATEGORIES_KO)[number];

export const CATEGORY_ES_MAP: Record<string, string> = {
  'K-POP': 'K-POP',
  드라마: 'Drama',
  뉴스: 'Noticias',
  문화: 'Cultura',
  스포츠: 'Deportes',
  음식: 'Comida',
};
