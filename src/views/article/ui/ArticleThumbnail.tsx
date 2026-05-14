import Image from 'next/image';
import { Chip } from '@/shared/ui';
import { UserRound } from 'lucide-react';
import { formatDateTime } from '@/shared/utils';
import { useArticles } from '@/features/article/model/useArticles';
export function ArticleThumbnail() {
  const { title, newsData: _newsData } = useArticles();
  const newsData = _newsData!;

  return (
    <div className="relative">
      <div className="h-[20rem] w-full overflow-hidden">
        <Image fill sizes="100vw" className="object-cover" src={newsData.thumbnailUrl} alt="" />
      </div>

      <div className="absolute top-0 left-0 flex flex-col justify-end items-start w-full h-[20rem] p-4 bg-black/40">
        <Chip text={newsData.category.name} color="red" />
        <h1 className="!mt-2 text-[1.4rem] text-white font-bold">{title}</h1>
        <div className="flex justify-between w-full mt-[1rem] text-[0.8rem] text-white">
          <span className="flex items-center justify-start">
            <UserRound color="#ffffff" className="h-[1rem]" />
            {newsData.viewCount}
          </span>
          <span>{formatDateTime(newsData.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}
