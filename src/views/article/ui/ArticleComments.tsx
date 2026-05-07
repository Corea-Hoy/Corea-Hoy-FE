import { CommentCard, CommentForm } from '@/features/comment';
import { ConfirmModal, NoData } from '@/shared/ui';
import { useComments } from '@/features/comment/model/useComments';
import { useUsersStore } from '@/entities/user';
import { useTranslations } from 'next-intl';

export function ArticleComments() {
  const {
    commentsData,
    textarea,
    setTextarea,
    editCommentId,
    showDeleteCommentModal,
    onEditComment,
    onCreateComment,
    onDeleteComment,
    onDeleteCommentModal,
    onUpdateComment,
    onCloseDeleteCommentModal,
  } = useComments();

  const { isLoggedIn } = useUsersStore();
  const t = useTranslations('content');

  return (
    <>
      <div className="mt-4 py-4 px-2 border-t border-t-gray-200">
        {isLoggedIn && (
          <CommentForm
            value={textarea}
            onChange={(e) => setTextarea(e.target.value)}
            onClick={() => onCreateComment(textarea)}
          />
        )}
      </div>
      <div>
        {commentsData.length >= 1 ? (
          commentsData.map((item) => (
            <CommentCard
              key={`${item.id}-${item.updatedAt}`}
              editCommentId={editCommentId}
              commentData={item}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onUpdateComment={onUpdateComment}
            />
          ))
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
