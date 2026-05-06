interface Props {
  show: boolean;
  text: string;
  cancelBtn?: boolean;
  onConfirm: () => void;
  onClose?: () => void;
}

export function ConfirmModal({ show, text, cancelBtn = true, onConfirm, onClose }: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 z-100 flex items-center justify-center w-full h-full bg-black/40"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="w-[100%] max-w-[25rem] h-auto rounded-3xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 컨텐츠 */}
        <div className="px-5 pt-8 pb-2">
          <p id="share-modal-title" className="text-center font-bold whitespace-pre-line">
            {text}
          </p>
        </div>

        {/* 푸터 */}
        <div className="flex gap-2 p-4">
          {cancelBtn && (
            <button
              type="button"
              className="flex-1 h-[2.5rem] text-base text-white font-bold rounded-xl bg-gray-400"
              onClick={onClose}
            >
              취소
            </button>
          )}
          <button
            type="button"
            className="flex-1 h-[2.5rem] text-base text-white font-bold rounded-xl bg-green-700"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
