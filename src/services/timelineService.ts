import { FEED_PAGE_SIZE } from '@/config/constants';
import { apiClient } from '@/lib/apiClient';
import type { CursorPage } from '@/types/api';
import type { FeedType, ProfileTweetTab, Tweet } from '@/types/tweet';

export type FeedFetcher = (cursor?: string) => Promise<CursorPage<Tweet>>;

const params = (cursor?: string) => ({ cursor, limit: FEED_PAGE_SIZE });

export const timelineService = {
  async home(feedType: FeedType, cursor?: string): Promise<CursorPage<Tweet>> {
    const { data } = await apiClient.get<CursorPage<Tweet>>('/timeline/home', {
      params: { feed_type: feedType, ...params(cursor) },
    });
    return data;
  },
  async byUser(
    username: string,
    tab: ProfileTweetTab,
    cursor?: string,
  ): Promise<CursorPage<Tweet>> {
    const { data } = await apiClient.get<CursorPage<Tweet>>(`/users/${username}/tweets`, {
      params: { tab, ...params(cursor) },
    });
    return data;
  },
  async bookmarks(cursor?: string): Promise<CursorPage<Tweet>> {
    const { data } = await apiClient.get<CursorPage<Tweet>>('/bookmarks', { params: params(cursor) });
    return data;
  },
};
