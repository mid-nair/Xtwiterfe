import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { exploreService } from '@/services/exploreService';
import { useTweetFeed } from './useTweetFeed';

export const useExploreTweets = (query: string) =>
  useTweetFeed(
    queryKeys.explore.tweets(query),
    (cursor) => exploreService.tweets(query, cursor),
    query.trim().length > 0,
  );

export const useExploreUsers = (query: string) =>
  useQuery({
    queryKey: queryKeys.explore.users(query),
    queryFn: () => exploreService.users(query),
    enabled: query.trim().length > 0,
  });
