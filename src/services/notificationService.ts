import { apiClient } from '@/lib/apiClient';
import type { CursorPage } from '@/types/api';
import type { AppNotification } from '@/types/notification';

export const notificationService = {
  async list(cursor?: string): Promise<CursorPage<AppNotification>> {
    const { data } = await apiClient.get<CursorPage<AppNotification>>('/notifications', {
      params: { cursor },
    });
    return data;
  },
  async unreadCount(): Promise<number> {
    const { data } = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return data.count;
  },
  async markAllRead(): Promise<void> {
    await apiClient.post('/notifications/read-all');
  },
  async markRead(notificationId: string): Promise<void> {
    await apiClient.post(`/notifications/${notificationId}/read`);
  },
};
