import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  return {
    locale: 'ko',
    messages: (await import('../../message/ko.json')).default,
  };
});
