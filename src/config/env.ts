const DEV_API_URL = '/api/v1';
const PROD_API_URL = 'https://xtwitterbe.onrender.com/api/v1';

const configuredApiUrl = import.meta.env.VITE_API_URL;

export const env = {
  apiUrl: import.meta.env.DEV
    ? configuredApiUrl || DEV_API_URL
    : configuredApiUrl && !configuredApiUrl.startsWith('/')
      ? configuredApiUrl
      : PROD_API_URL,
} as const;
