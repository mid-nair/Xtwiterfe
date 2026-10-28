import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ImagePlus, Upload, Video, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { MAX_TWEET_LENGTH } from '@/config/constants';
import { useCreateTweet } from '@/hooks/useCreateTweet';
import { useIsBirthdayUser } from '@/hooks/useIsBirthdayUser';
import { useRequiredUser } from '@/hooks/useRequiredUser';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useUploadVideo } from '@/hooks/useUploadVideo';
import { getErrorMessage } from '@/lib/apiError';
import { cn } from '@/lib/cn';
import { isHttpUrl } from '@/lib/validators';
import type { Tweet } from '@/types/tweet';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

interface AttachedVideo {
  /** Local blob: URL used for instant preview while the upload runs. */
  previewUrl: string;
  /** Hosted URL returned by the server once the upload finishes. */
  uploadedUrl: string | null;
}

interface TweetComposerProps {
  replyTo?: Tweet;
  autoFocus?: boolean;
  onPosted?: () => void;
}

export function TweetComposer({ replyTo, autoFocus, onPosted }: TweetComposerProps) {
  const user = useRequiredUser();
  const isBirthday = useIsBirthdayUser();
  const { mutate, isPending, error } = useCreateTweet();
  const upload = useUploadImage();
  const uploadVideo = useUploadVideo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoAbortRef = useRef<AbortController | null>(null);
  const videoRequestRef = useRef(0);

  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaOpen, setMediaOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [video, setVideo] = useState<AttachedVideo | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);

  const previewUrl = video?.previewUrl;
  // Free the blob URL when the preview is replaced, removed, or the composer unmounts.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // Cancel an in-flight video upload if the composer is closed.
  useEffect(() => () => videoAbortRef.current?.abort(), []);

  // The birthday girl manifests her posts instead of just posting them.
  const manifest = isBirthday && !replyTo;
  const placeholder = replyTo ? 'Post your reply' : manifest ? 'Manifest something… ✨' : "What's happening?";
  const submitLabel = replyTo ? 'Reply' : manifest ? 'Manifest ✨' : 'Post';

  const trimmed = content.trim();
  const remaining = MAX_TWEET_LENGTH - content.length;
  const hasImage = isHttpUrl(mediaUrl);
  const videoUploading = !!video && !video.uploadedUrl;
  const hasVideoReady = !!video?.uploadedUrl;
  const hasAnyMedia = hasImage || hasVideoReady;
  const canSubmit =
    (trimmed.length > 0 || hasAnyMedia) &&
    remaining >= 0 &&
    !isPending &&
    !upload.isPending &&
    !videoUploading;

  const clearVideo = () => {
    videoRequestRef.current += 1; // invalidate any pending upload callbacks
    videoAbortRef.current?.abort();
    videoAbortRef.current = null;
    setVideo(null);
    setVideoProgress(0);
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('Choose an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setFileError('Image must be 5MB or smaller.');
      return;
    }

    upload.mutate(file, {
      onSuccess: ({ url }) => {
        setMediaUrl(url);
        setMediaOpen(true);
      },
    });
  };

  const handleVideoFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setVideoError(null);
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setVideoError('Choose an MP4, WebM or MOV video.');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setVideoError('Video must be 50MB or smaller.');
      return;
    }

    // A post carries either a video or an image, never both.
    setMediaUrl('');
    setMediaOpen(false);
    clearVideo();

    const requestId = videoRequestRef.current;
    const controller = new AbortController();
    videoAbortRef.current = controller;
    setVideo({ previewUrl: URL.createObjectURL(file), uploadedUrl: null });
    setVideoProgress(0);

    uploadVideo.mutate(
      { file, signal: controller.signal, onProgress: setVideoProgress },
      {
        onSuccess: ({ url }) => {
          if (requestId !== videoRequestRef.current) return;
          setVideo((current) => (current ? { ...current, uploadedUrl: url } : current));
        },
        onError: (uploadError) => {
          if (requestId !== videoRequestRef.current) return;
          setVideo(null);
          setVideoProgress(0);
          setVideoError(getErrorMessage(uploadError, 'Video upload failed. Try again.'));
        },
      },
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const mediaUrls = video?.uploadedUrl ? [video.uploadedUrl] : hasImage ? [mediaUrl.trim()] : [];

    mutate(
      {
        content: trimmed,
        reply_to_tweet_id: replyTo?.id ?? null,
        quote_tweet_id: null,
        media_urls: mediaUrls,
      },
      {
        onSuccess: () => {
          setContent('');
          setMediaUrl('');
          setMediaOpen(false);
          setFileError(null);
          setVideoError(null);
          clearVideo();
          onPosted?.();
        },
      },
    );
  };

  const mediaError =
    fileError ?? videoError ?? (upload.error ? getErrorMessage(upload.error) : null);

  return (
    <div className="flex gap-3">
      <Avatar src={user.avatar_url} name={user.display_name} />

      <form onSubmit={handleSubmit} className="min-w-0 flex-1">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          autoFocus={autoFocus}
          rows={2}
          aria-label={replyTo ? 'Post your reply' : 'Post text'}
          placeholder={placeholder}
          className="field-sizing-content min-h-14 w-full resize-none bg-transparent py-2 text-xl outline-none placeholder:text-muted"
        />

        {mediaOpen && !video && (
          <div className="mb-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
                aria-label="Upload image"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={upload.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />
                Upload image
              </Button>
              <input
                type="url"
                value={mediaUrl}
                onChange={(event) => setMediaUrl(event.target.value)}
                placeholder="or paste an image URL"
                aria-label="Image URL"
                className="min-w-48 flex-1 rounded-lg border border-line bg-field px-3 py-1.5 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>
        )}

        {hasImage && !video && (
          <div className="relative mb-3 overflow-hidden rounded-2xl border border-line">
            <img src={mediaUrl.trim()} alt="Attachment preview" className="max-h-72 w-full object-cover" />
            <IconButton
              label="Remove image"
              onClick={() => setMediaUrl('')}
              className="absolute right-2 top-2 bg-black/70 text-white hover:bg-black"
            >
              <X className="size-4" />
            </IconButton>
          </div>
        )}

        {video && (
          <div className="relative mb-3 overflow-hidden rounded-2xl border border-line bg-black">
            <video
              src={video.previewUrl}
              controls
              playsInline
              preload="metadata"
              className="max-h-72 w-full"
            />
            <IconButton
              label="Remove video"
              onClick={clearVideo}
              className="absolute right-2 top-2 bg-black/70 text-white hover:bg-black"
            >
              <X className="size-4" />
            </IconButton>
            {videoUploading && (
              <div role="status" className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-sm text-white">
                <div className="mb-1 flex justify-between">
                  <span>{videoProgress >= 100 ? 'Processing video…' : 'Uploading video…'}</span>
                  <span className="tabular-nums">{videoProgress}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-brand transition-[width]"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleVideoFile}
          className="hidden"
          aria-label="Upload video"
        />

        <div className="flex items-center justify-between border-t border-line pt-3">
          <div className="-ml-2 flex items-center">
            <IconButton
              label="Add image"
              onClick={() => setMediaOpen((open) => !open)}
              disabled={!!video}
              className="text-brand hover:bg-brand/10 disabled:opacity-40"
            >
              <ImagePlus className="size-5" />
            </IconButton>
            <IconButton
              label="Add video"
              onClick={() => videoInputRef.current?.click()}
              disabled={hasImage || upload.isPending}
              className="text-brand hover:bg-brand/10 disabled:opacity-40"
            >
              <Video className="size-5" />
            </IconButton>
          </div>

          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <span
                aria-live="polite"
                className={cn(
                  'text-sm tabular-nums',
                  remaining < 0 ? 'text-red-500' : remaining <= 20 ? 'text-amber-500' : 'text-muted',
                )}
              >
                {remaining}
              </span>
            )}
            <Button type="submit" size="sm" disabled={!canSubmit} loading={isPending}>
              {submitLabel}
            </Button>
          </div>
        </div>

        {mediaError && (
          <p role="alert" className="mt-2 text-sm text-red-500">
            {mediaError}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-500">
            {getErrorMessage(error)}
          </p>
        )}
      </form>
    </div>
  );
}
