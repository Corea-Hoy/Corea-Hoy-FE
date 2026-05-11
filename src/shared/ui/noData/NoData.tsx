import { Info } from 'lucide-react';

interface Props {
  text: string;
}

export function NoData({ text = '데이터가 없습니다.' }: Props) {
  return (
    <div className="flex items-center justify-center flex-col gap-1.5 min-h-[10rem]">
      <Info color="#6a7282" className="h-[1.4rem]" />
      <p className="font-bold text-gray-500 text-base">{text}</p>
    </div>
  );
}
