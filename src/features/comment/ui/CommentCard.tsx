'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { CommentsResponse } from '@/entities/comment/model/types';
import { formatDate } from '@/shared/utils';
import { useUsersStore } from '@/entities/user';
import { CommentForm } from '@/features/comment';
import { useState } from 'react';

interface Props {
  editCommentId: string | null;
  commentData: CommentsResponse;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateComment: (textarea: string) => void;
}

export function CommentCard({
  editCommentId,
  commentData,
  onEdit,
  onDelete,
  onUpdateComment,
}: Props) {
  const isEdit = editCommentId === commentData.id;
  const { user, isLoggedIn } = useUsersStore();

  const [textarea, setTextarea] = useState(commentData.body);

  return (
    <div className="py-3 px-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <b className="text-[0.9rem]">{commentData.user.nickname}</b>
        {isLoggedIn && !isEdit && user?.id === commentData.user.id && (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              aria-label="comment delete"
              onClick={() => onDelete(commentData.id)}
            >
              <Trash2 className="h-[1rem] stroke-red-400" />
            </button>
            <button type="button" aria-label="comment edit" onClick={() => onEdit(commentData.id)}>
              <Pencil className="h-[1rem] stroke-blue-400" />
            </button>
          </div>
        )}
      </div>
      <span className="text-[0.8rem] text-gray-300">{formatDate(commentData.updatedAt)}</span>

      <div>
        {isEdit ? (
          <CommentForm
            value={textarea}
            onChange={(e) => setTextarea(e.target.value)}
            onClick={() => onUpdateComment(textarea)}
          />
        ) : (
          <p className="mt-3 text-[0.9rem]">{commentData.body}</p>
        )}
      </div>
    </div>
  );
}
