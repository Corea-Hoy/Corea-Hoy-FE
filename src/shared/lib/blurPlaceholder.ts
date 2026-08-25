const shimmer = (w: number, h: number) =>
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#f3f4f6" /></svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export const blurDataURL = (w = 32, h = 32) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
