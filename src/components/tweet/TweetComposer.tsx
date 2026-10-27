import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { MAX_TWEET_LENGTH } from '@/config/constants';
import { useCreateTweet } from '@/hooks/useCreateTweet';
import { useRequiredUser } from '@/hooks/useRequiredUser';
import { useUploadImage } from '@/hooks/useUploadImage';
import { getErrorMessage } from '@/lib/apiError';
import { cn } from '@/lib/cn';
import { isHttpUrl } from '@/lib/validators';
import type { Tweet } from '@/types/tweet';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface TweetComposerProps {
  replyTo?: Tweet;
  autoFocus?: boolean;
  onPosted?: () => void;
}

export function TweetComposer({ replyTo, autoFocus, onPosted }: TweetComposerProps) {
  const user = useRequiredUser();
  const { mutate, isPending, error } = useCreateTweet();
  const upload = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaOpen, setMediaOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const trimmed = content.trim();
  const remaining = MAX_TWEET_LENGTH - content.length;
  const hasMedia = isHttpUrl(mediaUrl);
  const canSubmit = trimmed.length > 0 && remaining >= 0 && !isPending && !upload.isPending;

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    mutate(
      {
        content: trimmed,
        reply_to_tweet_id: replyTo?.id ?? null,
        quote_tweet_id: null,
        media_urls: hasMedia ? [mediaUrl.trim()] : [],
      },
      {
        onSuccess: () => {
          setContent('');
          setMediaUrl('');
          setMediaOpen(false);
          setFileError(null);
          onPosted?.();
        },
      },
    );
  };

  const mediaError = fileError ?? (upload.error ? getErrorMessage(upload.error) : null);

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
          placeholder={replyTo ? 'Post your reply' : "What's happening?"}
          className="field-sizing-content min-h-14 w-full resize-none bg-transparent py-2 text-xl outline-none placeholder:text-muted"
        />

        {mediaOpen && (
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

        {hasMedia && (
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

        <div className="flex items-center justify-between border-t border-line pt-3">
          <IconButton
            label="Add image"
            onClick={() => setMediaOpen((open) => !open)}
            className="-ml-2 text-brand hover:bg-brand/10"
          >
            <ImagePlus className="size-5" />
          </IconButton>

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
              {replyTo ? 'Reply' : 'Post'}
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
