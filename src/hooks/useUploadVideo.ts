import { useMutation } from '@tanstack/react-query';
import { uploadService, type UploadVideoOptions } from '@/services/uploadService';

interface Variables extends UploadVideoOptions {
    file: File;
}

export function useUploadVideo() {
    return useMutation({
        mutationFn: ({ file, ...options }: Variables) => uploadService.video(file, options),
    });
}
