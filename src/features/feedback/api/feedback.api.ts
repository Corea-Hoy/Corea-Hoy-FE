import api from '@/shared/api/axios';
import { FeedbackRequest, FeedbackResponse } from '@/entities/feedback/model/types';

/**
 * 피드백 폼 제출
 * @param data
 **/
export const feedbackContent = (data: FeedbackRequest) => {
  return api.post<FeedbackResponse>('/api/feedback', data);
};
