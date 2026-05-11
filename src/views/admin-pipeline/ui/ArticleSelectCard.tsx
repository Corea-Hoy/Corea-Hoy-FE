import type { AdminCandidateArticle } from '../model/types';

interface ArticleSelectCardProps {
  article: AdminCandidateArticle;
  isSelected: boolean;
  onSelect: (articleId: string) => void;
}

export function ArticleSelectCard({ article, isSelected, onSelect }: ArticleSelectCardProps) {
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

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-gray-400">
        <span>{article.source}</span>
        <span>{article.date}</span>
      </div>
    </div>
  );
}
