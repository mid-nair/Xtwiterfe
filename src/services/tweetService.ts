import { FEED_PAGE_SIZE } from '@/config/constants';
import { apiClient } from '@/lib/apiClient';
import type { CursorPage } from '@/types/api';
import type { CreateTweetPayload, EngagementAction, Tweet } from '@/types/tweet';

export interface TweetDetail {
  tweet: Tweet;
  parent: Tweet | null;
}

export const tweetService = {
  async create(payload: CreateTweetPayload): Promise<Tweet> {
    const { data } = await apiClient.post<Tweet>('/tweets', payload);
    return data;
  },
  async engage(tweetId: string, action: EngagementAction): Promise<void> {
    await apiClient.post(`/tweets/${tweetId}/engage`, { action });
  },
  async detail(tweetId: string): Promise<TweetDetail> {
    const { data } = await apiClient.get<TweetDetail>(`/tweets/${tweetId}`);
    return data;
  },
  async replies(tweetId: string, cursor?: string): Promise<CursorPage<Tweet>> {
    const { data } = await apiClient.get<CursorPage<Tweet>>(`/tweets/${tweetId}/replies`, {
      params: { cursor, limit: FEED_PAGE_SIZE },
    });
    return data;
  },
};
