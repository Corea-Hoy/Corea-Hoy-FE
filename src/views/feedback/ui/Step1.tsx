'use client';

import { CategoryButtons } from '@/features/feedback';
import { useState } from 'react';
import { CategoryButton } from '@/features/feedback/ui/CategoryButtons';
import { FeedbackType } from '@/entities/feedback/model/types';

interface Props {
  onChange: (index: number, value: FeedbackType) => void;
  onClick: (activeButton: number | null) => void;
  other: string;
  onOtherChange: (value: string) => void;
}

export function Step1({ onClick, onChange, other, onOtherChange }: Props) {
  const buttons = [
    {
      image: '/images/illu/illu-design.webp',
      text: '디자인 / 사용',
      value: 'ui',
    },
    {
      image: '/images/illu/illu-content.webp',
      text: '콘텐츠 퀄리티',
      value: 'content',
    },
    {
      image: '/images/illu/illu-mistranslations.webp',
      text: '오역 및 번역 제안',
      value: 'translation',
    },
    {
      image: '/images/illu/illu-new.webp',
      text: '새로운 기능 제안',
      value: 'feature',
    },
    {
      image: '/images/illu/illu-bug.webp',
      text: '버그 및 오류',
      value: 'bug',
    },
    {
      image: '/images/illu/illu-comments.webp',
      text: '기타 의견',
      value: 'other',
    },
  ] as CategoryButton;

  const [activeButton, setActiveButton] = useState<number | null>(null);

  const onSelectCategory = (index: number, value: FeedbackType) => {
    setActiveButton(index);
    onChange(index, value);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-x-2 gap-y-6 ">
        <CategoryButtons
          buttons={buttons}
          activeIndex={activeButton}
          onChange={(i, value) => onSelectCategory(i, value)}
        />
      </div>
      {activeButton === 5 && (
        <div className="mt-[1.4rem]">
          <label htmlFor="otherInput" className="sr-only">
            기타 카테고리 입력
          </label>
          <input
            id="otherInput"
            type="text"
            placeholder="카테고리를 입력해주세요."
            className="w-full py-2 px-4 rounded-2xl bg-white outline-none"
            value={other}
            onChange={(e) => onOtherChange(e.target.value)}
          />
        </div>
      )}
      <button
        type="button"
        className={`mt-12 ml-auto block w-[4rem] h-[2.5rem] rounded-xl text-base text-white font-bold ${
          activeButton == null ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 cursor-pointer'
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
