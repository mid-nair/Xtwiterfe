import { apiClient } from '@/lib/apiClient';
import type {
  ProfileUser,
  SuggestedUser,
  UpdateProfilePayload,
} from '@/types/user';

export const userService = {
  async getProfile(username: string): Promise<ProfileUser> {
    const { data } = await apiClient.get<ProfileUser>(`/users/${username}`);
    return data;
  },
  async suggestions(): Promise<SuggestedUser[]> {
    const { data } = await apiClient.get<SuggestedUser[]>('/users/suggestions');
    return data;
  },
  async search(query: string): Promise<SuggestedUser[]> {
    const { data } = await apiClient.get<SuggestedUser[]>('/users/search', { params: { q: query } });
    return data;
  },
  async follow(userId: string): Promise<void> {
    await apiClient.post(`/users/${userId}/follow`);
  },
  async unfollow(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/follow`);
  },
  async updateProfile(payload: UpdateProfilePayload): Promise<ProfileUser> {
    const { data } = await apiClient.patch<ProfileUser>('/users/me', payload);
    return data;
  },
};
