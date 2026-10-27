import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { applyEngagement, patchTweetInFeeds, type FeedData } from '@/lib/tweetCache';
import { tweetService } from '@/services/tweetService';
import type { TweetDetail } from '@/services/tweetService';
import type { EngagementAction } from '@/types/tweet';

interface Variables {
  tweetId: string;
  action: EngagementAction;
}

const REPOST_ACTIONS: EngagementAction[] = ['REPOST', 'UNREPOST'];

export function useEngageTweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tweetId, action }: Variables) => tweetService.engage(tweetId, action),
    onMutate: async ({ tweetId, action }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.feeds.all }),
        queryClient.cancelQueries({ queryKey: queryKeys.tweets.all }),
      ]);
      const snapshot = [
        ...queryClient.getQueriesData({ queryKey: queryKeys.feeds.all }),
        ...queryClient.getQueriesData({ queryKey: queryKeys.tweets.all }),
      ];

      patchTweetInFeeds(queryClient, tweetId, (tweet) => applyEngagement(tweet, action));
      queryClient.setQueriesData<FeedData>(
        { queryKey: queryKeys.tweets.repliesAll },
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              data: page.data.map((tweet) =>
                tweet.id === tweetId ? applyEngagement(tweet, action) : tweet,
              ),
            })),
          },
      );
      queryClient.setQueryData<TweetDetail>(queryKeys.tweets.detail(tweetId), (detail) => {
        if (!detail) return detail;
        return {
          tweet:
            detail.tweet.id === tweetId
              ? applyEngagement(detail.tweet, action)
              : detail.tweet,
          parent:
            detail.parent && detail.parent.id === tweetId
              ? applyEngagement(detail.parent, action)
              : detail.parent,
        };
      });

      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: (_data, _error, { action }) => {
      if (!REPOST_ACTIONS.includes(action)) return;
      void queryClient.invalidateQueries({ queryKey: queryKeys.feeds.userAll });
    },
  });
}
