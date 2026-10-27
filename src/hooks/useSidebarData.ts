import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { trendService } from '@/services/trendService';
import { userService } from '@/services/userService';

const FIVE_MINUTES = 5 * 60_000;

export const useTrends = () =>
  useQuery({ queryKey: queryKeys.trends, queryFn: trendService.list, staleTime: FIVE_MINUTES });

export const useWhoToFollow = () =>
  useQuery({ queryKey: queryKeys.suggestions, queryFn: userService.suggestions, staleTime: FIVE_MINUTES });

export const useUserProfile = (username: string) =>
  useQuery({
    queryKey: queryKeys.users.profile(username),
    queryFn: () => userService.getProfile(username),
    enabled: !!username,
  });
