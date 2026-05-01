export interface AdminCandidateArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
}

export type PipelineStep = 'select-article' | 'review-content' | 'review-translation' | 'preview';

export interface GeneratedContent {
  title: string;
  category: string;
  body: string;
}

export interface TranslatedContent {
  koTitle: string;
  koBody: string;
  esTitle: string;
  esBody: string;
}

export type TranslationTargetLanguage = 'es';
export type TranslationTargetLanguageSelection = TranslationTargetLanguage | '';

export const TRANSLATION_TARGET_LANGUAGES: {
  code: TranslationTargetLanguage;
  label: string;
}[] = [{ code: 'es', label: '스페인어' }];

export const MOCK_ADMIN_ARTICLES: AdminCandidateArticle[] = [
  {
    id: 'article-1',
    title: 'BTS 뷔, 솔로 앨범 발매 예정 발표',
    summary: 'BTS 멤버 뷔가 두 번째 솔로 앨범을 5월 중 발매할 예정이라고 소속사가 밝혔다.',
    source: 'Naver 뉴스',
    date: '2026-04-22',
  },
  {
    id: 'article-2',
    title: 'BLACKPINK 리사, 월드투어 일정 공개',
    summary: 'BLACKPINK 리사가 첫 솔로 월드투어 일정을 공개했다. 멕시코, 아르헨티나, 브라질 포함.',
    source: 'Melon 뉴스',
    date: '2026-04-22',
  },
  {
    id: 'article-3',
    title: "넷플릭스 신작 한국 드라마 '무빙2' 확정",
    summary: "넷플릭스가 한국 슈퍼히어로 드라마 '무빙' 시즌2를 정식 발표했다.",
    source: '한국경제',
    date: '2026-04-21',
  },
  {
    id: 'article-4',
    title: '손흥민, 시즌 20호골 달성',
    summary: '토트넘의 손흥민이 프리미어리그에서 시즌 20호골을 기록했다.',
    source: '스포츠조선',
    date: '2026-04-21',
  },
  {
    id: 'article-5',
    title: '2026 한국 관광 트렌드: 로컬 감성 여행',
    summary: "한국관광공사가 2026년 외국인 관광 트렌드로 '로컬 감성 여행'을 꼽았다.",
    source: '한국관광공사',
    date: '2026-04-20',
  },
];

export function createMockGeneratedContent(article: AdminCandidateArticle): GeneratedContent {
  return {
    title: `${article.title}: 라틴아메리카 독자를 위한 핵심 정리`,
    category: '',
    body: `${article.summary}

이번 소식은 한국 콘텐츠와 사회적 흐름을 이해하는 데 중요한 단서가 됩니다. 단순한 화제성을 넘어, 한국 문화가 해외 독자에게 어떻게 전달되는지 보여주는 사례로 볼 수 있습니다.

특히 라틴아메리카 독자에게는 사건 자체보다 그 배경과 맥락을 함께 설명하는 것이 중요합니다. 한국의 빠른 트렌드 변화, 팬덤 문화, 미디어 반응을 함께 살펴보면 이 이슈가 가진 의미를 더 입체적으로 이해할 수 있습니다.`,
  };
}

export function createMockArticleOriginalText(article: AdminCandidateArticle): string {
  return `${article.summary}

이번 소식은 관련 업계와 팬덤, 대중문화 전반에서 주목받고 있습니다. 관계자들은 이번 발표가 향후 국내외 반응에 적지 않은 영향을 미칠 것으로 보고 있습니다.

특히 ${article.source}는 이번 이슈가 단기적인 화제에 그치지 않고 여러 후속 논의로 이어질 가능성이 있다고 전했습니다. 관련 분야 전문가들은 한국 콘텐츠의 확산 속도와 해외 독자의 관심이 맞물리면서 비슷한 흐름이 계속 나타날 수 있다고 분석했습니다.

다만 아직 구체적인 세부 내용은 추가 확인이 필요한 상황입니다. 업계는 공식 발표와 후속 보도를 지켜보며 향후 일정을 확인할 예정입니다.`;
}

export function createMockTranslatedContent(
  content: GeneratedContent,
  targetLanguage: TranslationTargetLanguage,
): TranslatedContent {
  if (targetLanguage === 'es') {
    return {
      koTitle: content.title,
      koBody: content.body,
      esTitle: `[ES] ${content.title}`,
      esBody: `[Traducido] ${content.body}`,
    };
  }

  return {
    koTitle: content.title,
    koBody: content.body,
    esTitle: '',
    esBody: '',
  };
}
