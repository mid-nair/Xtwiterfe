import axios from 'axios';

const FALLBACK = 'Something went wrong. Try again.';

export function getErrorMessage(error: unknown, fallback = FALLBACK): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.code === 'ERR_NETWORK') return 'Can’t reach the server. Check your connection.';
    return error.response?.data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
