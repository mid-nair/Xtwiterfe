import { apiClient } from '@/lib/apiClient';

export interface UploadedImage {
  url: string;
  public_id: string;
}

export const uploadService = {
  async image(file: File): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await apiClient.post<UploadedImage>('/uploads/image', formData);
    return data;
  },
};
