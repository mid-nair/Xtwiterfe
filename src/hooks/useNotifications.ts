import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from '@/lib/queryKeys';
import { messageService } from '@/services/messageService';
import { notificationService } from '@/services/notificationService';

const POLL_INTERVAL = 30_000;

export function useNotifications() {
  const query = useInfiniteQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: ({ pageParam }) => notificationService.list(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    refetchInterval: POLL_INTERVAL,
  });

  const notifications = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );

  return {
    notifications,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.notifications.unreadCount, 0);
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list });
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

function usePollingCount(queryKey: readonly unknown[], queryFn: () => Promise<number>) {
  const { data } = useQuery({
    queryKey,
    queryFn,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
  return data ?? 0;
}

export function useUnreadCounts() {
  return {
    notifications: usePollingCount(
      queryKeys.notifications.unreadCount,
      notificationService.unreadCount,
    ),
    messages: usePollingCount(
      queryKeys.conversations.unreadCount,
      messageService.unreadCount,
    ),
  };
}
