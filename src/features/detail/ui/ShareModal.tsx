import { X, Link } from 'lucide-react';

interface Props {
  show: boolean;
  onClick: () => void;
}

const buttonStyle = 'w-[3rem] h-[3rem] border border-gray-200 rounded-full p-2.5';

export function ShareModal({ show, onClick }: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 z-100 flex items-center justify-center w-full h-full bg-black/40"
      onClick={onClick}
    >
      <div className="w-[20rem] h-auto rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end p-3">
          <button onClick={onClick}>
            <X />
          </button>
        </div>
        <div className="px-5 pb-8">
          <p className="text-center font-bold">이 소식을 함께 나눠보세요.</p>
          <div className="flex items-center justify-center gap-4 mt-5">
            <button className={buttonStyle}>
              <img src="/images/icon/icon-x.webp" alt="x" />
            </button>
            <button className={buttonStyle}>
              <img src="/images/icon/icon-kakao.webp" alt="카카오톡" />
            </button>
            <button className={buttonStyle}>
              <img src="/images/icon/icon-facebook.webp" alt="페이스북" />
            </button>
            <button className={buttonStyle}>
              <Link />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
