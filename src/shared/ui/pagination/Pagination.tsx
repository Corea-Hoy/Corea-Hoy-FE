interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, currentPage), safeTotalPages);

  if (safeTotalPages <= 1) return null;

  const pages: (number | '...')[] = [];

  if (safeTotalPages <= 7) {
    for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (safePage > 3) pages.push('...');
    for (let i = Math.max(2, safePage - 1); i <= Math.min(safeTotalPages - 1, safePage + 1); i++) {
      pages.push(i);
    }
    if (safePage < safeTotalPages - 2) pages.push('...');
    pages.push(safeTotalPages);
  }

  return (
    <div
      role="navigation"
      aria-label="페이지 탐색"
      className="flex items-center justify-center gap-1 mt-4"
    >
      <button
        type="button"
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage === 1}
        aria-label="이전 페이지"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        ‹
      </button>
      {pages.map((page, i) =>
        page === '...' ? (
          <span
            key={`dots-${i}`}
            aria-hidden="true"
            className="w-8 h-8 flex items-center justify-center text-sm text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            aria-label={`${page}페이지`}
            aria-current={safePage === page ? 'page' : undefined}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors cursor-pointer ${
              safePage === page ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage === safeTotalPages}
        aria-label="다음 페이지"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        ›
      </button>
    </div>
  );
}
