import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { FeedFetcher } from '@/services/timelineService';

/** Generic cursor-paginated tweet feed. Feed-specific hooks live in useFeeds.ts. */
export function useTweetFeed(queryKey: readonly unknown[], fetchPage: FeedFetcher, enabled = true) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled,
  });

  const tweets = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);

  return {
    tweets,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}

export type TweetFeedState = ReturnType<typeof useTweetFeed>;
