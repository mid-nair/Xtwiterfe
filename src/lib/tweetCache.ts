import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type { CursorPage } from '@/types/api';
import type { EngagementAction, Tweet, TweetStats, ViewerContext } from '@/types/tweet';

export type FeedData = InfiniteData<CursorPage<Tweet>, string | undefined>;

interface Effect {
  flag: keyof ViewerContext;
  stat: keyof Pick<TweetStats, 'likes' | 'reposts' | 'bookmarks'>;
  on: boolean;
}

const EFFECTS: Record<EngagementAction, Effect> = {
  LIKE: { flag: 'liked', stat: 'likes', on: true },
  UNLIKE: { flag: 'liked', stat: 'likes', on: false },
  REPOST: { flag: 'reposted', stat: 'reposts', on: true },
  UNREPOST: { flag: 'reposted', stat: 'reposts', on: false },
  BOOKMARK: { flag: 'bookmarked', stat: 'bookmarks', on: true },
  UNBOOKMARK: { flag: 'bookmarked', stat: 'bookmarks', on: false },
};

/** Pure: returns the tweet as it should look after the action succeeds. */
export function applyEngagement(tweet: Tweet, action: EngagementAction): Tweet {
  const { flag, stat, on } = EFFECTS[action];
  if (tweet.viewer_context[flag] === on) return tweet;
  return {
    ...tweet,
    viewer_context: { ...tweet.viewer_context, [flag]: on },
    stats: { ...tweet.stats, [stat]: Math.max(0, tweet.stats[stat] + (on ? 1 : -1)) },
  };
}

/** Patches one tweet in every cached feed (home, profile, bookmarks). */
export function patchTweetInFeeds(
  queryClient: QueryClient,
  tweetId: string,
  update: (tweet: Tweet) => Tweet,
): void {
  queryClient.setQueriesData<FeedData>({ queryKey: queryKeys.feeds.all }, (data) =>
    data && {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        data: page.data.map((tweet) => (tweet.id === tweetId ? update(tweet) : tweet)),
      })),
    },
  );
}

export function prependTweetToFeeds(queryClient: QueryClient, queryKey: QueryKey, tweet: Tweet): void {
  queryClient.setQueriesData<FeedData>({ queryKey }, (data) => {
    const [first, ...rest] = data?.pages ?? [];
    if (!data || !first) return data;
    return { ...data, pages: [{ ...first, data: [tweet, ...first.data] }, ...rest] };
  });
}
