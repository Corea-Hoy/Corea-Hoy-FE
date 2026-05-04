import { FEEDBACK_MIN_LENGTH, FEEDBACK_MAX_LENGTH } from '@/features/feedback/model/constants';

/**
 * 콘텐츠 유효성 검사
 * 입력 필수, 최소 10자 최대 1000자 제한
 * @param content
 **/
export const validateContent = (content: string) => {
  if (!content) return '내용을 입력해주세요';

  if (content.trim().length < FEEDBACK_MIN_LENGTH || content.length > FEEDBACK_MAX_LENGTH)
    return `최소 ${FEEDBACK_MIN_LENGTH}자, 최대 ${FEEDBACK_MAX_LENGTH}자까지 입력할 수 있습니다.`;

  return '';
};
