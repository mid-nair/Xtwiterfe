import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { userService } from '@/services/userService';
import type { CursorPage } from '@/types/api';
import type { ConnectionUser, ProfileUser, SuggestedUser } from '@/types/user';

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
      queryClient.setQueriesData<ProfileUser>({ queryKey: queryKeys.users.profileAll }, (profile) =>
        profile?.id === userId
          ? {
            ...profile,
            is_following: follow,
            follower_count: Math.max(0, profile.follower_count + (follow ? 1 : -1)),
          }
          : profile,
      );
      // Keep every cached Followers / Following list in sync too.
      queryClient.setQueriesData<InfiniteData<CursorPage<ConnectionUser>, string | undefined>>(
        { queryKey: queryKeys.users.connectionsAll },
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              data: page.data.map((user) =>
                user.id === userId ? { ...user, is_following: follow } : user,
              ),
            })),
          },
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
