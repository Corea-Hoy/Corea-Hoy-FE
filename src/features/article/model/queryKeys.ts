export const articleKeys = {
  detail: (id: string) => ['newsDetail', id] as const,
  comments: (id: string) => ['newsComments', id] as const,
};
