import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { timelineService } from '@/services/timelineService';
import { tweetService } from '@/services/tweetService';
import type { FeedType, ProfileTweetTab } from '@/types/tweet';
import { useTweetFeed } from './useTweetFeed';

export const useHomeTimeline = (feedType: FeedType) =>
  useTweetFeed(queryKeys.feeds.home(feedType), (cursor) => timelineService.home(feedType, cursor));

export const useUserTweets = (username: string, tab: ProfileTweetTab = 'posts') =>
  useTweetFeed(
    queryKeys.feeds.user(username, tab),
    (cursor) => timelineService.byUser(username, tab, cursor),
    !!username,
  );

export const useBookmarks = () =>
  useTweetFeed(queryKeys.feeds.bookmarks, (cursor) => timelineService.bookmarks(cursor));

export const useTweetDetail = (tweetId: string) =>
  useQuery({
    queryKey: queryKeys.tweets.detail(tweetId),
    queryFn: () => tweetService.detail(tweetId),
    enabled: !!tweetId,
  });

export const useTweetReplies = (tweetId: string) =>
  useTweetFeed(
    queryKeys.tweets.replies(tweetId),
    (cursor) => tweetService.replies(tweetId, cursor),
    !!tweetId,
  );
