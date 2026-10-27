import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (profile) => {
      updateUser({
        display_name: profile.display_name,
        bio: profile.bio,
        location: profile.location,
        website_url: profile.website_url,
        avatar_url: profile.avatar_url,
        banner_url: profile.banner_url,
      });
      queryClient.setQueryData(queryKeys.users.profile(profile.username), profile);
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.feeds.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all });
    },
  });
}
