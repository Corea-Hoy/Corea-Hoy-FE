import { Trash2 } from 'lucide-react';

export function CommentCard() {
  return (
    <div className="py-3 px-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <b className="text-[0.9rem]">사용자명</b>
        <button>
          <Trash2 className="h-[1rem] stroke-red-400" />
        </button>
      </div>
      <span className="text-[0.8rem] text-gray-300">2024-01-03</span>

      <div>
        <p className="mt-3 text-[0.9rem]">댓글 내용이 들어갑니다.</p>
      </div>
    </div>
  );
}
