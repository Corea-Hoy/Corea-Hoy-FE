interface Props {
  onClick: () => void;
}

export function Step2({ onClick }: Props) {
  return (
    <>
      <div>
        <div className="flex flex-col gap-2">
          <label htmlFor="emailInput" className="font-bold text-[1.4rem]">
            이메일 주소<em className="text-red-500">*</em>
          </label>
          <input
            id="emailInput"
            className="border-b border-b-gray-300 outline-none text-base"
            type="text"
            placeholder="test@test.com"
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <label htmlFor="contentsInput" className="font-bold text-[1.4rem] outline-none">
            자세한 내용을 들려주세요<em className="text-red-500">*</em>
          </label>
          <div className="p-4 rounded-2xl bg-white ">
            <textarea
              id="contentsInput"
              rows={6}
              className="w-full text-base resize-none outline-none"
              placeholder="의견을 작성해주세요."
            />
          </div>
        </div>
      </div>
      <button
        className="mt-12 ml-auto inline-block w-full h-[3rem] rounded-xl text-base text-white font-bold bg-green-700 cursor-pointer"
        onClick={onClick}
      >
        제출
      </button>
    </>
  );
}
