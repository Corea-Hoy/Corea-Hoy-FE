'use client';

import { FEEDBACK_MAX_LENGTH } from '@/features/feedback/model/constants';

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
  return (
    <form>
      <div>
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="emailInput" className="font-bold text-[1.4rem]">
            이메일 주소<em className="text-red-500">*</em>
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
            자세한 내용을 들려주세요<em className="text-red-500">*</em>
          </label>
          <div className="p-4 rounded-2xl bg-white ">
            <textarea
              id="contentsInput"
              rows={6}
              className="w-full text-base resize-none outline-none"
              placeholder="최소 10자, 최대 1000자까지 입력할 수 있습니다."
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
        className="mt-12 ml-auto inline-block w-full h-[3rem] rounded-xl text-base text-white font-bold bg-green-700 cursor-pointer"
        onClick={onClick}
      >
        제출
      </button>
    </form>
  );
}
