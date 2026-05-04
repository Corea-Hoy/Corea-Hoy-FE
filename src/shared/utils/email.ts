/**
 * 이메일 유효성 검사
 * 글자수 제한 1~50자
 * @param email
 **/
export const validateEmail = (email: string) => {
  const regex = /^(?=.{1,50}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) return '이메일을 입력해주세요.';
  if (!regex.test(email)) return '이메일 형식이 올바르지 않습니다.';
  return '';
};
