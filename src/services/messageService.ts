import { apiClient } from '@/lib/apiClient';
import type { CursorPage } from '@/types/api';
import type { Conversation, Message } from '@/types/message';

const PAGE_SIZE = 30;

export const messageService = {
  async conversations(): Promise<Conversation[]> {
    const { data } = await apiClient.get<Conversation[]>('/conversations');
    return data;
  },
  async openConversation(userId: string): Promise<Conversation> {
    const { data } = await apiClient.post<Conversation>('/conversations', { user_id: userId });
    return data;
  },
  async messages(conversationId: string, cursor?: string): Promise<CursorPage<Message>> {
    const { data } = await apiClient.get<CursorPage<Message>>(
      `/conversations/${conversationId}/messages`,
      { params: { cursor, limit: PAGE_SIZE } },
    );
    return data;
  },
  async send(conversationId: string, content: string): Promise<Message> {
    const { data } = await apiClient.post<Message>(
      `/conversations/${conversationId}/messages`,
      { content },
    );
    return data;
  },
  async markRead(conversationId: string): Promise<void> {
    await apiClient.post(`/conversations/${conversationId}/read`);
  },
  async unreadCount(): Promise<number> {
    const { data } = await apiClient.get<{ count: number }>('/conversations/unread-count');
    return data.count;
  },
};
