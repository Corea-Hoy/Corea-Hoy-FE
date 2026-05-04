const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

if (!API_URL && typeof window !== 'undefined') {
  console.warn('[ENV] NEXT_PUBLIC_API_URL is not set. API requests may fail.');
}

export const ENV = {
  API_URL,
} as const;
