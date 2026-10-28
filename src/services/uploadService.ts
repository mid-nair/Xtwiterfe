import { apiClient } from '@/lib/apiClient';

export interface UploadedImage {
  url: string;
  public_id: string;
}

export type UploadedVideo = UploadedImage;

export interface UploadVideoOptions {
  /** Called with 0–100 while the file is being sent to the server. */
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

// Videos are much larger than images, so allow far longer than the 60s default.
const VIDEO_UPLOAD_TIMEOUT_MS = 5 * 60_000;

export const uploadService = {
  async image(file: File): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await apiClient.post<UploadedImage>('/uploads/image', formData);
    return data;
  },
  async video(file: File, { onProgress, signal }: UploadVideoOptions = {}): Promise<UploadedVideo> {
    const formData = new FormData();
    formData.append('video', file);
    const { data } = await apiClient.post<UploadedVideo>('/uploads/video', formData, {
      timeout: VIDEO_UPLOAD_TIMEOUT_MS,
      signal,
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
        }
      },
    });
    return data;
  },
};
