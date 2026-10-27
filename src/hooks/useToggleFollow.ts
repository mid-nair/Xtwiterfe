import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { userService } from '@/services/userService';
import type { ProfileUser, SuggestedUser } from '@/types/user';

interface Variables {
  userId: string;
  follow: boolean;
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, follow }: Variables) =>
      follow ? userService.follow(userId) : userService.unfollow(userId),
    onMutate: ({ userId, follow }) => {
      queryClient.setQueriesData<SuggestedUser[]>({ queryKey: queryKeys.suggestions }, (list) =>
        list?.map((user) => (user.id === userId ? { ...user, is_following: follow } : user)),
      );
      queryClient.setQueriesData<ProfileUser>({ queryKey: queryKeys.users.all }, (profile) =>
        profile?.id === userId
          ? { ...profile, is_following: follow, follower_count: profile.follower_count + (follow ? 1 : -1) }
          : profile,
      );
    },
    // Settling always re-syncs with the server, which also repairs a failed optimistic update.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.suggestions });
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.explore.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.feeds.home('following') });
    },
  });
}
