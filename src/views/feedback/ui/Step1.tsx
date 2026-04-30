'use client';

import { CategoryButtons } from '@/features/feedback';
import { useState } from 'react';

interface Props {
  onClick: (activeButton: number | null) => void;
}

export function Step1({ onClick }: Props) {
  const buttons = [
    {
      image: '/images/illu/illu-design.webp',
      text: '디자인 / 사용',
    },
    {
      image: '/images/illu/illu-content.webp',
      text: '콘텐츠 퀄리티',
    },
    {
      image: '/images/illu/illu-mistranslations.webp',
      text: '오역 및 번역 제안',
    },
    {
      image: '/images/illu/illu-new.webp',
      text: '새로운 기능 제안',
    },
    {
      image: '/images/illu/illu-bug.webp',
      text: '버그 및 오류',
    },
    {
      image: '/images/illu/illu-comments.webp',
      text: '기타 의견',
    },
  ];

  const [activeButton, setActiveButton] = useState<number | null>(null);

  const onChange = (index: number) => {
    setActiveButton(index);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-x-2 gap-y-6 ">
        <CategoryButtons
          buttons={buttons}
          activeIndex={activeButton}
          onChange={(i) => onChange(i)}
        />
      </div>
      <button
        className={`mt-12 ml-auto block w-[4rem] h-[2.5rem] rounded-xl text-base text-white font-bold ${
          activeButton == null
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-700 cursor-pointer'
        }`}
        disabled={activeButton == null}
        onClick={() => {
          if (activeButton != null) {
            onClick(activeButton);
          }
        }}
        aria-disabled={activeButton == null}
      >
        다음
      </button>
    </>
  );
}
