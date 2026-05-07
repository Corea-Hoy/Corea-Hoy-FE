import { CommentCard, CommentForm } from '@/features/comment';
import { ConfirmModal, NoData } from '@/shared/ui';
import { useComments } from '@/features/comment/model/useComments';
import { useUsersStore } from '@/entities/user';

export function ArticleComments() {
  const {
    commentsData,
    textarea,
    setTextarea,
    editCommentId,
    showDeleteCommentModal,
    setShowDeleteCommentModal,
    onEditComment,
    onCreateComment,
    onDeleteComment,
    onDeleteCommentModal,
    onUpdateComment,
  } = useComments();

  const { user, isLoggedIn } = useUsersStore();

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
              key={item.id}
              editCommentId={editCommentId}
              commentData={item}
              onEdit={(id) => onEditComment(id)}
              onDelete={(id) => onDeleteComment(id)}
              onUpdateComment={(comment) => onUpdateComment(comment)}
            />
          ))
        ) : (
          <NoData text="이 기사에 대한 첫 의견을 남겨보세요." />
        )}
      </div>

      {/* 댓글 삭제 확인 모달 */}
      <ConfirmModal
        show={showDeleteCommentModal}
        text="정말 이 댓글을 삭제하시겠습니까?"
        onConfirm={onDeleteCommentModal}
        onClose={() => setShowDeleteCommentModal(false)}
      />
    </>
  );
}
