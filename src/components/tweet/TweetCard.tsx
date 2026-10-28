import { memo, useCallback, useMemo, useState, type MouseEvent } from 'react';
import { Repeat2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { cn } from '@/lib/cn';
import { formatRelativeTime } from '@/lib/format';
import type { Tweet, TweetMedia } from '@/types/tweet';
import { ComposeModal } from './ComposeModal';
import { TweetActions } from './TweetActions';

interface TweetCardProps {
  tweet: Tweet;
  detail?: boolean;
}

const VIDEO_EXTENSION_RE = /\.(mp4|webm|mov|m4v)(?:$|[?#])/i;

/** Fallback for older responses that only carry `media_urls`. */
function inferMediaType(url: string): TweetMedia['type'] {
  return url.includes('/video/upload/') || VIDEO_EXTENSION_RE.test(url) ? 'video' : 'image';
}

/**
 * Prefer the typed `media` list from the API; fall back to `media_urls`
 * (typed by URL) so videos are never rendered as broken <img> tags.
 */
function getTweetMedia(tweet: Tweet): TweetMedia[] {
  if (tweet.media && tweet.media.length > 0) return tweet.media;
  return (tweet.media_urls ?? []).map((url) => ({ url, type: inferMediaType(url) }));
}

export const TweetCard = memo(function TweetCard({ tweet, detail }: TweetCardProps) {
  const { user, reply_to_user: replyToUser, reposted_by: repostedBy } = tweet;
  const navigate = useNavigate();
  const [replying, setReplying] = useState(false);
  const closeReply = useCallback(() => setReplying(false), []);

  const media = useMemo(() => getTweetMedia(tweet), [tweet]);

  const openDetail = (event: MouseEvent<HTMLElement>) => {
    // Don't navigate when interacting with links, buttons or the video player controls.
    if ((event.target as HTMLElement).closest('a,button,video')) return;
    navigate(`/tweet/${tweet.id}`);
  };

  return (
    <article
      onClick={openDetail}
      className={cn(
        'cursor-pointer border-b border-line transition-colors hover:bg-hover',
        detail && 'cursor-default hover:bg-transparent',
      )}
    >
      {repostedBy && (
        <div className="flex items-center gap-2 px-4 pt-2 text-[13px] font-bold text-muted sm:pl-[4.25rem]">
          <Repeat2 className="size-4" aria-hidden="true" />
          <span>{repostedBy.display_name} reposted</span>
        </div>
      )}

      <div className="flex gap-3 px-4 pb-1 pt-3">
        <Link to={`/${user.username}`} tabIndex={-1} aria-hidden="true">
          <Avatar src={user.avatar_url} name={user.display_name} />
        </Link>

        <div className="min-w-0 flex-1">
          <header className="flex items-center gap-1 text-[15px]">
            <Link to={`/${user.username}`} className="truncate font-bold hover:underline">
              {user.display_name}
            </Link>
            {user.is_verified && <VerifiedBadge />}
            <span className="truncate text-muted">@{user.username}</span>
            <span aria-hidden="true" className="text-muted">·</span>
            <Link to={`/tweet/${tweet.id}`} className="shrink-0 text-muted hover:underline">
              <time dateTime={tweet.created_at}>{formatRelativeTime(tweet.created_at)}</time>
            </Link>
          </header>

          {replyToUser && (
            <p className="text-[13px] text-muted">
              Replying to{' '}
              <Link to={`/${replyToUser.username}`} className="text-brand hover:underline">
                @{replyToUser.username}
              </Link>
            </p>
          )}

          {tweet.content && (
            <p
              className={cn(
                'mt-0.5 whitespace-pre-wrap break-words leading-5',
                detail ? 'text-[17px] leading-6' : 'text-[15px]',
              )}
            >
              {tweet.content}
            </p>
          )}

          {media.length > 0 && (
            <div
              className={cn(
                'mt-3 grid gap-0.5 overflow-hidden rounded-2xl border border-line',
                media.length > 1 && 'grid-cols-2',
              )}
            >
              {media.slice(0, 4).map((item) =>
                item.type === 'video' ? (
                  <video
                    key={item.url}
                    src={item.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="max-h-96 w-full bg-black object-contain"
                  />
                ) : (
                  <img
                    key={item.url}
                    src={item.url}
                    alt=""
                    loading="lazy"
                    className="max-h-96 w-full object-cover"
                  />
                ),
              )}
            </div>
          )}

          <TweetActions tweet={tweet} onReply={() => setReplying(true)} />
        </div>
      </div>

      <ComposeModal open={replying} onClose={closeReply} replyTo={tweet} />
    </article>
  );
});
