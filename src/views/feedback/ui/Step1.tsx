'use client';

import { CategoryButtons } from '@/features/feedback';
import { useState } from 'react';
import { CategoryButton } from '@/features/feedback/ui/CategoryButtons';
import { FeedbackType } from '@/entities/feedback/model/types';
import { useTranslations } from 'next-intl';

interface Props {
  onChange: (value: FeedbackType) => void;
  onClick: () => void;
  other: string;
  onOtherChange: (value: string) => void;
}

export function Step1({ onClick, onChange, other, onOtherChange }: Props) {
  const t = useTranslations();
  const buttons: CategoryButton[] = [
    {
      image: '/images/illu/illu-design.webp',
      text: t('feedback.designUsage'),
      value: 'ui',
    },
    {
      image: '/images/illu/illu-content.webp',
      text: t('feedback.contentQuality'),
      value: 'content',
    },
    {
      image: '/images/illu/illu-mistranslations.webp',
      text: t('feedback.translationSuggestion'),
      value: 'translation',
    },
    {
      image: '/images/illu/illu-new.webp',
      text: t('feedback.featureSuggestion'),
      value: 'feature',
    },
    {
      image: '/images/illu/illu-bug.webp',
      text: t('feedback.bugError'),
      value: 'bug',
    },
    {
      image: '/images/illu/illu-comments.webp',
      text: t('feedback.other'),
      value: 'other',
    },
  ];

  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [activeButtonValue, setActiveButtonValue] = useState<FeedbackType | null>(null);
  const nextDisabled =
    activeButtonValue == null || (activeButtonValue === 'other' && other.trim().length === 0);

  const onSelectCategory = (index: number, value: FeedbackType) => {
    setActiveButton(index);
    setActiveButtonValue(value);
    onChange(value);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-x-2 gap-y-6">
        <CategoryButtons
          buttons={buttons}
          activeIndex={activeButton}
          onChange={(i, value) => onSelectCategory(i, value)}
        />
      </div>
      {activeButtonValue === 'other' && (
        <div className="mt-[1.4rem]">
          <label htmlFor="otherInput" className="sr-only">
            other category input
          </label>
          <input
            id="otherInput"
            type="text"
            placeholder={t('feedback.categoryInput')}
            className="w-full py-2 px-4 rounded-2xl bg-white outline-none"
            value={other}
            onChange={(e) => onOtherChange(e.target.value)}
          />
        </div>
      )}
      <button
        type="button"
        className={`mt-12 ml-auto block min-w-[4rem] w-auto h-[2.5rem] px-[0.4rem] rounded-xl text-base text-white font-bold bg-green-700 cursor-pointer disabled:bg-black disabled:opacity-30 disabled:cursor-not-allowed`}
        disabled={nextDisabled}
        onClick={onClick}
        aria-disabled={nextDisabled}
      >
        {t('common.next')}
      </button>
    </>
  );
}
