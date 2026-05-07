function decodeHtmlEntities(value: string) {
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  return value
    .replaceAll(/&#(\d+);/g, (_, codePoint: string) => String.fromCodePoint(Number(codePoint)))
    .replaceAll(/&#x([\da-f]+);/gi, (_, codePoint: string) =>
      String.fromCodePoint(Number.parseInt(codePoint, 16)),
    )
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'");
}

export function getTextFromRichTextHtml(value: string) {
  return decodeHtmlEntities(value.replaceAll(/<br\s*\/?>/gi, '\n').replaceAll(/<[^>]*>/g, ' '))
    .replaceAll('\u00a0', ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}
