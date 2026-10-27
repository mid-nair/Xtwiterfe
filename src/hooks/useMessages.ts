import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from '@/lib/queryKeys';
import { messageService } from '@/services/messageService';

const CONVERSATIONS_POLL = 15_000;
const MESSAGES_POLL = 5_000;

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations.list,
    queryFn: messageService.conversations,
    refetchInterval: CONVERSATIONS_POLL,
  });
}

export function useConversationMessages(conversationId: string) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.conversations.messages(conversationId),
    queryFn: ({ pageParam }) => messageService.messages(conversationId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled: !!conversationId,
    refetchInterval: MESSAGES_POLL,
  });

  const messages = useMemo(
    () => query.data?.pages.flatMap((page) => page.data).slice().reverse() ?? [],
    [query.data],
  );

  return {
    messages,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => messageService.send(conversationId, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.messages(conversationId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.unreadCount });
    },
  });
}

export function useOpenConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => messageService.openConversation(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list });
    },
  });
}

export function useMarkConversationRead(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => messageService.markRead(conversationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.unreadCount });
    },
  });
}
