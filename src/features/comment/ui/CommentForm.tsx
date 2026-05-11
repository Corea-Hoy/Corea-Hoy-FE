import { useRef } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick: () => void;
}

export function CommentForm({ value, onChange, onClick }: Props) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const t = useTranslations('content');

  const handleInput = () => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = 'auto'; // 초기화
    el.style.height = el.scrollHeight + 'px'; // 내용만큼 늘림
  };

  return (
    <div className="flex gap-2 items-end w-full h-auto py-[0.4rem] px-[0.6rem] rounded-xl bg-gray-100">
      <label htmlFor="commnet" className="sr-only">
        {t('comments')}
      </label>
      <textarea
        ref={inputRef}
        id="commnet"
        rows={1}
        value={value}
        className="
        w-full
        pl-1.5
        resize-none
        overflow-hidden
        outline-none
      "
        placeholder={t('commentPlaceholder')}
        onInput={handleInput}
        onChange={onChange}
      />
      <button
        className="block ml-auto min-w-fit max-h-[2.2rem] py-[0.2rem] px-[0.6rem] rounded-xl font-bold text-base text-white bg-black disabled:opacity-30"
        disabled={value.trim().length < 10}
        onClick={onClick}
      >
        {t('submit')}
      </button>
    </div>
  );
}
