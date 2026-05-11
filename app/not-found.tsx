'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const route = useRouter();

  return (
    <div className="relative flex items-center justify-center gap-2 h-[65vh]">
      <div>
        <div className="m-auto w-[0.5rem] h-[0.5rem] rounded-full bg-green-700" />
        <h1 className="!mt-[0.4rem] text-[2rem] text-center font-bold text-green-800">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="my-4 text-center text-base text-gray-500">
          방문하시려는 페이지의 주소가 잘못 입력되었거나, <br />
          페이지의 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
        </p>
        <button
          type="button"
          className="block m-auto w-[6rem] h-[3rem] font-bold text-base rounded-xl text-white bg-green-700"
          onClick={() => route.push('/')}
        >
          돌아가기
        </button>
      </div>
      <div className="absolute z-[-1] right-[-1rem] bottom-[-3rem] w-[12rem]">
        <img src="/images/characters/mascot.svg" alt="" />
      </div>
    </div>
  );
}
