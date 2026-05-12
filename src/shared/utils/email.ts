import { useTranslations } from 'next-intl';

type T = ReturnType<typeof useTranslations>;

/**
 * 이메일 유효성 검사
 * 글자수 제한 1~50자
 * @param email
 * @param t
 **/
export const validateEmail = (email: string, t: T) => {
  const regex = /^(?=.{1,50}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) return t('common.emailRequired');
  if (!regex.test(email)) return t('common.emailInvalid');
  return '';
};
