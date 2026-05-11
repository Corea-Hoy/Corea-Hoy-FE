import { FeedbackType } from '@/entities/feedback/model/types';

export type CategoryButton = {
  image: string;
  text: string;
  value: FeedbackType;
};

interface Props {
  buttons: CategoryButton[];
  activeIndex: number | null;
  onChange: (index: number, value: FeedbackType) => void;
}

export function CategoryButtons({ buttons, activeIndex, onChange }: Props) {
  return (
    <>
      {buttons.map((item, i) => (
        <button
          key={i}
          value={item.value}
          className={`flex justify-center items-center flex-col gap-2 py-4.5 px-3.5 rounded-xl border-2 border-transparent cursor-pointer ${i === activeIndex ? '!border-green-500 bg-green-200/10' : 'bg-white'}`}
          onClick={() => onChange(i, item.value)}
        >
          <img className="w-[3.5rem]" src={item.image} alt="" />
          <span className="break-all">{item.text}</span>
        </button>
      ))}
    </>
  );
}
