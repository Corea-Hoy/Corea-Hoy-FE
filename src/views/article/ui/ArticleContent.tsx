import { useArticles } from '@/features/article/model/useArticles';

export function ArticleContent() {
  const { body, note } = useArticles();
  return (
    <div className="py-12">
      <div dangerouslySetInnerHTML={{ __html: body ?? '' }}></div>

      {/* 요약 */}
      <div className="my-8 p-4 border border-amber-200 rounded-xl bg-amber-50">
        <h3 className="text-amber-500 font-bold">오늘의 한국 한 스푼</h3>
        <p className="mt-3 text-amber-500">{note}</p>
      </div>
    </div>
  );
}
