import { ReactNode } from 'react';

interface Props {
  show: boolean;
  title?: string;
  text: ReactNode;
  confirmText?: string;
  onConfirm: () => void;
}

export function AlertModal({ show, title, text, confirmText = '확인', onConfirm }: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 z-100 flex items-center justify-center w-full h-full bg-black/40"
      onClick={onConfirm}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-[100%] max-w-[22rem] h-auto rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 컨텐츠 */}
        <div className="px-6 pt-10 pb-6 text-center">
          {title && <h3 className="text-xl font-black mb-3">{title}</h3>}
          <div className="text-base font-medium text-gray-700 whitespace-pre-line leading-relaxed">
            {text}
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-5 pt-0">
          <button
            type="button"
            className="w-full h-[3.5rem] text-lg text-white font-bold rounded-2xl bg-green-600 hover:bg-green-700 transition-colors cursor-pointer shadow-lg shadow-green-600/20"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
