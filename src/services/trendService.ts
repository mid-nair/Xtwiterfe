import { apiClient } from '@/lib/apiClient';
import type { Trend } from '@/types/trend';

export const trendService = {
  async list(): Promise<Trend[]> {
    const { data } = await apiClient.get<Trend[]>('/trends');
    return data;
  },
};
