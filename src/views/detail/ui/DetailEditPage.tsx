export function DetailEditPage() {
  const buttonStyle = 'h-[2rem] w-[3rem] text-base border leading-none rounded-xl';
  return (
    <div>
      {/* 타이틀, 날짜 */}
      <div className="pt-6 px-2 pb-2 border-b border-b border-gray-100">
        <label htmlFor="titleInput" className="sr-only">
          title input
        </label>
        <input
          id="titleInput"
          type="text"
          placeholder="제목 입력"
          className="w-full h-[2.5rem] outline-none text-[1.5rem] font-bold"
        />
      </div>

      {/* 컨텐츠 */}
      <div className="py-4">
        <div>{/*  TODO 썸네일 확인 추가  */}</div>
        <div>{/*  TODO 에디터 추가  */}</div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between pt-4 pr-2 border-t border-t-gray-100">
        <span>2024-02-01</span>
        <div className="flex items-center justify-end gap-1">
          <button type="button" className={`${buttonStyle} text-red-600 bg-red-100`}>
            삭제
          </button>
          <button type="button" className={`${buttonStyle} text-green-700 bg-green-100`}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
