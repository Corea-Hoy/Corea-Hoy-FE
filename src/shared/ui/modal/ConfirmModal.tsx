import { ReactNode } from 'react';

interface Props {
  show: boolean;
  title?: string;
  text: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  show,
  title,
  text,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onClose,
}: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 z-100 flex items-center justify-center w-full h-full bg-black/40"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-[100%] max-w-[25rem] h-auto rounded-3xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 컨텐츠 */}
        <div className="px-6 pt-8 pb-4 text-center">
          {title && (
            <h3 id="confirm-modal-title" className="text-xl font-black mb-3">
              {title}
            </h3>
          )}
          <div className="text-base font-medium text-gray-700 whitespace-pre-line leading-relaxed">
            {text}
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex gap-3 p-5">
          <button
            type="button"
            className="flex-1 h-[3rem] text-base text-gray-600 font-bold rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="flex-1 h-[3rem] text-base text-white font-bold rounded-2xl bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
