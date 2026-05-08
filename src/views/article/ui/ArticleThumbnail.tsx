import Image from 'next/image';
import { CATEGORY_LABEL, ROLE } from '@/entities/article';
import { Chip } from '@/shared/ui';
import { UserRound } from 'lucide-react';
import { formatDate } from '@/shared/utils';
import { useUsersStore } from '@/entities/user';
import { useArticles } from '@/features/article/model/useArticles';

export function ArticleThumbnail() {
  const { title, newsData: _newsData, onEdit, onDeletePost } = useArticles();
  const newsData = _newsData!;

  const { user, isLoggedIn } = useUsersStore();

  const buttonStyle = 'h-[2rem] w-[3rem] text-base border leading-none rounded-xl';
  return (
    <div className="relative">
      <div className="h-[20rem] w-full overflow-hidden">
        <Image fill sizes="100vw" className="object-cover" src={newsData.thumbnailUrl} alt="" />
      </div>

      {isLoggedIn && user?.role === ROLE.ADMIN && (
        <div className="absolute right-[0.7rem] top-4 z-50 flex gap-1">
          <button className={`${buttonStyle} text-red-600 bg-red-100`} onClick={onDeletePost}>
            삭제
          </button>
          <button className={`${buttonStyle} text-green-700 bg-green-100`} onClick={onEdit}>
            수정
          </button>
        </div>
      )}

      <div className="absolute top-0 left-0 flex flex-col justify-end items-start w-full h-[20rem] p-4 bg-black/40">
        <Chip text={CATEGORY_LABEL[newsData.category.id]} color="red" />
        <h1 className="!mt-2 text-[1.4rem] text-white font-bold">{title}</h1>
        <div className="flex justify-between w-full mt-[1rem] text-[0.8rem] text-white">
          <span className="flex items-center justify-start">
            <UserRound color="#ffffff" className="h-[1rem]" />
            {newsData.viewCount}
          </span>
          <span>{formatDate(newsData.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}
