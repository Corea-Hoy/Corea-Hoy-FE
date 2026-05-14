import { useTranslations } from 'next-intl';
import type { AdminCandidateArticle } from '../model/types';

interface ArticleSelectCardProps {
  article: AdminCandidateArticle;
  isSelected: boolean;
  onSelect: (articleId: string) => void;
}

export function ArticleSelectCard({ article, isSelected, onSelect }: ArticleSelectCardProps) {
  const t = useTranslations('admin');
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(article.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(article.id);
        }
      }}
      className={`block rounded-2xl border-2 p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-black bg-gray-50 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-black leading-snug text-black">{article.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">{article.summary}</p>
        </div>
        <input
          type="radio"
          name="pipeline-article"
          checked={isSelected}
          readOnly
          onClick={(event) => {
            event.stopPropagation();
            onSelect(article.id);
          }}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-black cursor-pointer"
          aria-label={`${article.title} 선택`}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-gray-400">
        <span>{article.source}</span>
        <span>{article.date}</span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="ml-auto flex items-center gap-1 rounded-full border border-gray-400 px-2.5 py-1 font-bold text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
        >
          {t('viewOriginal')}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
