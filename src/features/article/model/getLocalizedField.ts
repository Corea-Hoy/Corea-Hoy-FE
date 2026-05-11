export type Locale = 'ko' | 'es';

export const getLocalizedField = (
  data: Record<string, unknown> | undefined,
  field: string,
  locale: Locale,
): string | undefined => {
  if (!data) return;

  const suffix = locale === 'ko' ? 'Ko' : 'Es';
  return data[`${field}${suffix}`] as string;
};
