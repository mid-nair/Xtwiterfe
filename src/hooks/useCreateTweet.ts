import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { patchTweetInFeeds, prependTweetToFeeds } from '@/lib/tweetCache';
import { tweetService } from '@/services/tweetService';
import type { TweetDetail } from '@/services/tweetService';

export function useCreateTweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tweetService.create,
    onSuccess: (tweet) => {
      if (tweet.reply_to_tweet_id) {
        const parentId = tweet.reply_to_tweet_id;
        patchTweetInFeeds(queryClient, parentId, (parent) => ({
          ...parent,
          stats: { ...parent.stats, replies: parent.stats.replies + 1 },
        }));
        queryClient.setQueryData<TweetDetail>(queryKeys.tweets.detail(parentId), (detail) =>
          detail
            ? {
                ...detail,
                tweet: {
                  ...detail.tweet,
                  stats: { ...detail.tweet.stats, replies: detail.tweet.stats.replies + 1 },
                },
              }
            : detail,
        );
        void queryClient.invalidateQueries({ queryKey: queryKeys.tweets.replies(parentId) });
        void queryClient.invalidateQueries({ queryKey: queryKeys.feeds.userAll });
        void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        return;
      }

      prependTweetToFeeds(queryClient, queryKeys.feeds.home('for_you'), tweet);
      void queryClient.invalidateQueries({ queryKey: queryKeys.feeds.userAll });
      void queryClient.invalidateQueries({ queryKey: queryKeys.explore.all });
    },
  });
}
