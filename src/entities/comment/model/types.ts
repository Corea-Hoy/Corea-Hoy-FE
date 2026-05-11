export type CommentsResponse = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
};

export type CommentUser = {
  id: string;
  nickname: string;
  avatarEmoji: string | null;
};

export type CommentsRequest = {
  id: string;
  body: string;
};

export type CommentListRequest = {
  id: string;
  cursor?: string;
};

export type CommentsListResponse = {
  data: CommentsResponse[];
  nextCursor: string | null;
};
