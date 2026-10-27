import { FEED_PAGE_SIZE } from '@/config/constants';
import { apiClient } from '@/lib/apiClient';
import type { CursorPage } from '@/types/api';
import type { Tweet } from '@/types/tweet';
import type { SuggestedUser } from '@/types/user';

export const exploreService = {
  async tweets(query: string, cursor?: string): Promise<CursorPage<Tweet>> {
    const { data } = await apiClient.get<CursorPage<Tweet>>('/explore/tweets', {
      params: { q: query, cursor, limit: FEED_PAGE_SIZE },
    });
    return data;
  },
  async users(query: string): Promise<SuggestedUser[]> {
    const { data } = await apiClient.get<SuggestedUser[]>('/explore/users', {
      params: { q: query },
    });
    return data;
  },
};
