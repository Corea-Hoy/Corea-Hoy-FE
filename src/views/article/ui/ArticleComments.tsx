import { CommentCard, CommentForm } from '@/features/comment';
import { ConfirmModal, NoData } from '@/shared/ui';
import { useComments } from '@/features/comment/model/useComments';
import { useUsersStore } from '@/entities/user';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

export function ArticleComments() {
  const {
    commentsData,
    hasNextPage,
    textarea,
    setTextarea,
    editCommentId,
    editTextarea,
    setEditTextarea,
    showDeleteCommentModal,
    onEditComment,
    onCreateComment,
    onDeleteComment,
    onDeleteCommentModal,
    onUpdateComment,
    onCloseDeleteCommentModal,
    onMoreComment,
  } = useComments();

  const { isLoggedIn } = useUsersStore();
  const t = useTranslations('content');

  return (
    <>
      {/* 댓글 입력창 */}
      <div className="mt-4 py-4 px-2 border-t border-t-gray-200">
        {isLoggedIn && (
          <CommentForm
            value={textarea}
            onChange={(e) => setTextarea(e.target.value)}
            onClick={() => onCreateComment(textarea)}
          />
        )}
      </div>
      {/* 댓글 내용 */}
      <div>
        {commentsData.length >= 1 ? (
          <>
            {commentsData.map((item) => (
              <CommentCard
                key={item.id}
                editCommentId={editCommentId}
                editTextarea={editTextarea}
                setEditTextarea={setEditTextarea}
                commentData={item}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                onUpdateComment={onUpdateComment}
              />
            ))}
            {hasNextPage && (
              <button
                type="button"
                className="block mt-3 flex items-center justify-center w-full h-[2.5rem] border border-gray-200 rounded-md"
                onClick={onMoreComment}
              >
                <Plus color="#6a7282" className="relative top-[-0.1rem] h-[1.2rem]" />
                <span className="text-base text-gray-500 font-bold">더보기</span>
              </button>
            )}
          </>
        ) : (
          <NoData text={t('firstComment')} />
        )}
      </div>

      {/* 댓글 삭제 확인 모달 */}
      <ConfirmModal
        show={showDeleteCommentModal}
        text={t('deleteCommentConfirm')}
        onConfirm={onDeleteCommentModal}
        onClose={onCloseDeleteCommentModal}
      />
    </>
  );
}
