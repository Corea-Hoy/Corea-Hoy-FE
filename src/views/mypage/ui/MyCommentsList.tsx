import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface MyComment {
  id: string;
  contentId: string;
  contentTitle: string;
  body: string;
  createdAt: string;
}

interface MyCommentsListProps {
  comments: MyComment[];
}

export function MyCommentsList({ comments }: MyCommentsListProps) {
  const t = useTranslations('mypage');

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">💬 {t('commentTitle')}</h2>
      {comments.length === 0 ? (
        <p className="text-center text-gray-300 py-12 border border-dashed border-gray-200 rounded-2xl text-sm">
          {t('emptyComment')}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((cm) => (
            <div key={cm.id} className="border border-gray-100 bg-white rounded-xl p-4">
              <Link
                href={`/article/${cm.contentId}`}
                className="text-sm text-blue-500 font-semibold hover:underline"
              >
                {cm.contentTitle}
              </Link>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{cm.body}</p>
              <span className="text-xs text-gray-300 mt-1 block">{cm.createdAt}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
