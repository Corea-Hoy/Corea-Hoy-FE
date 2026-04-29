import { useRef } from 'react';

export function CommentForm() {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = () => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = 'auto'; // 초기화
    el.style.height = el.scrollHeight + 'px'; // 내용만큼 늘림
  };

  return (
    <div className="flex gap-2 items-end w-full h-auto py-[0.4rem] px-[0.6rem] rounded-xl bg-gray-100">
      <label htmlFor="commnet" className="sr-only">
        댓글입력창
      </label>
      <textarea
        ref={inputRef}
        rows={1}
        onInput={handleInput}
        className="
        w-full
        pl-1.5
        resize-none
        overflow-hidden
        outline-none
      "
        placeholder="댓글을 입력하세요"
      />
      <button className="block ml-auto min-w-fit max-h-[2.2rem] py-[0.2rem] px-[0.6rem] rounded-xl font-bold text-base text-white bg-black">
        등록
      </button>
    </div>
  );
}
