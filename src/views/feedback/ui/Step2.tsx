'use client';

import { FEEDBACK_MAX_LENGTH } from '@/features/feedback/model/constants';
import { useTranslations } from 'next-intl';
import { validateEmail } from '@/shared/utils';
import { validateContent } from '@/features/feedback/model/validate';

interface Props {
  email: string;
  contents: string;
  emailError: string;
  contentError: string;
  onEmailChange: (value: string) => void;
  onContentsChange: (value: string) => void;
  onClick: () => void;
}

export function Step2({
  email,
  contents,
  emailError,
  contentError,
  onEmailChange,
  onContentsChange,
  onClick,
}: Props) {
  const t = useTranslations();
  const submitDisabled =
    validateEmail(email.trim(), t) !== '' || validateContent(contents.trim(), t) !== '';

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="emailInput" className="font-bold text-[1.4rem]">
            {t('feedback.emailTitle')}
            <em className="text-red-500">*</em>
          </label>
          <input
            id="emailInput"
            className="border-b border-b-gray-300 outline-none text-base"
            type="email"
            placeholder="test@test.com"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <p className="text-base text-red-600">{emailError}</p>
        </div>

        {/* 컨텐츠 */}
        <div className="mt-8 flex flex-col gap-2">
          <label htmlFor="contentsInput" className="font-bold text-[1.4rem] outline-none">
            {t('feedback.contentTitle')}
            <em className="text-red-500">*</em>
          </label>
          <div className="p-4 rounded-2xl bg-white ">
            <textarea
              id="contentsInput"
              rows={6}
              className="w-full text-base resize-none outline-none"
              placeholder={t('feedback.feedbackPlaceholder')}
              required
              maxLength={FEEDBACK_MAX_LENGTH}
              value={contents}
              onChange={(e) => onContentsChange(e.target.value)}
            />
          </div>
          <p className="text-base text-red-600">{contentError}</p>
        </div>
      </div>
      <button
        type="button"
        className="mt-12 ml-auto inline-block w-full h-[3rem] rounded-xl text-base text-white font-bold bg-green-700 cursor-pointer disabled:opacity-30 disabled:bg-black disabled:cursor-not-allowed"
        disabled={submitDisabled}
        onClick={onClick}
      >
        {t('common.submit')}
      </button>
    </form>
  );
}
