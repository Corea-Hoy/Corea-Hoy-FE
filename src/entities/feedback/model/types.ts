export type FeedbackType = 'ui' | 'content' | 'translation' | 'feature' | 'bug' | 'other';

export type FeedbackRequest = {
  category: string;
  otherCategory: string;
  body: string;
  email: string;
};

export type FeedbackResponse = {
  success: boolean;
  message: string;
};
