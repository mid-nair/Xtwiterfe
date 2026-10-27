const DEV_API_URL = '/api/v1';
const PROD_API_URL = 'https://xtwitterbe.onrender.com/api/v1';

export const env = {
  apiUrl:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? DEV_API_URL : PROD_API_URL),
} as const;
