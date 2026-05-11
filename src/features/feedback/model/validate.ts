import { FEEDBACK_MIN_LENGTH, FEEDBACK_MAX_LENGTH } from '@/features/feedback/model/constants';
import { useTranslations } from 'next-intl';

type T = ReturnType<typeof useTranslations>;

/**
 * 콘텐츠 유효성 검사
 * 입력 필수, 최소 10자 최대 1000자 제한
 * @param content
 * @param t
 **/
export const validateContent = (content: string, t: T) => {
  const normalized = content.trim();
  if (!normalized) return t('common.contentRequired');

  if (normalized.length < FEEDBACK_MIN_LENGTH || normalized.length > FEEDBACK_MAX_LENGTH)
    return t('feedback.lengthMessage', { min: FEEDBACK_MIN_LENGTH, max: FEEDBACK_MAX_LENGTH });

  return '';
};
