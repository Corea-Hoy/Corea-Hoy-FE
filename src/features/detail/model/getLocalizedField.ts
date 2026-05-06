type Locale = 'ko' | 'es';

export const getLocalizedField = (data: Record<string, string>, field: string, locale: Locale) => {
  if (!data) return;

  const suffix = locale === 'ko' ? 'Ko' : 'Es';
  return data[`${field}${suffix}`];
};
