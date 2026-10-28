import { useEffect, useMemo, useState } from 'react';
import { Play, X } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUserTweets } from '@/hooks/useFeeds';
import { useIsBirthdayUser } from '@/hooks/useIsBirthdayUser';
import { useRequiredUser } from '@/hooks/useRequiredUser';
import { getTweetMedia } from '@/lib/tweetMedia';
import type { TweetMedia } from '@/types/tweet';

interface Memory extends TweetMedia {
  id: string;
  caption: string;
}

function Lightbox({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    const previousOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Memory"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/90 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <IconButton label="Close" onClick={onClose} className="absolute right-3 top-3 text-white hover:bg-white/10">
        <X className="size-5" />
      </IconButton>

      {memory.type === 'video' ? (
        <video src={memory.url} controls autoPlay playsInline className="max-h-[80vh] max-w-full rounded-xl" />
      ) : (
        <img src={memory.url} alt={memory.caption} className="max-h-[80vh] max-w-full rounded-xl object-contain" />
      )}

      {memory.caption && <p className="max-w-xl text-center text-[15px] text-white/90">{memory.caption}</p>}
    </div>
  );
}

/** A photo-and-video gallery of everything she has posted. Only for the birthday account. */
export function MemoriesPage() {
  const isBirthday = useIsBirthdayUser();
  const user = useRequiredUser();
  const feed = useUserTweets(user.username, 'media');
  const [active, setActive] = useState<Memory | null>(null);

  const memories = useMemo<Memory[]>(
    () =>
      feed.tweets.flatMap((tweet) =>
        getTweetMedia(tweet).map((item, index) => ({
          ...item,
          id: `${tweet.id}-${index}`,
          caption: tweet.content,
        })),
      ),
    [feed.tweets],
  );

  const sentinelRef = useInfiniteScroll({
    enabled: !!feed.hasNextPage && !feed.isFetchingNextPage,
    onReach: () => void feed.fetchNextPage(),
  });

  if (!isBirthday) return <Navigate to="/" replace />;

  return (
    <>
      <PageHeader title="Memories 💜" subtitle={memories.length > 0 ? `${memories.length} moments` : undefined} />

      {feed.isLoading ? (
        <Spinner />
      ) : feed.isError && memories.length === 0 ? (
        <StateMessage
          title="Couldn’t load your memories"
          description="Something went wrong while fetching them."
          action={<Button onClick={() => void feed.refetch()}>Try again</Button>}
        />
      ) : memories.length === 0 ? (
        <StateMessage title="No memories yet" description="Photos and videos you post will collect here." />
      ) : (
        <div className="columns-2 gap-1 p-1">
          {memories.map((memory) => (
            <button
              key={memory.id}
              type="button"
              onClick={() => setActive(memory)}
              aria-label={memory.caption ? `Open memory: ${memory.caption}` : 'Open memory'}
              className="group relative mb-1 block w-full break-inside-avoid overflow-hidden rounded-xl bg-field"
            >
              {memory.type === 'video' ? (
                <>
                  <video src={memory.url} muted playsInline preload="metadata" className="w-full bg-black object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="rounded-full bg-black/60 p-3 text-white">
                      <Play className="size-6 fill-current" />
                    </span>
                  </span>
                </>
              ) : (
                <img
                  src={memory.url}
                  alt=""
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div ref={sentinelRef} />
      {feed.isFetchingNextPage && <Spinner />}

      {active && <Lightbox memory={active} onClose={() => setActive(null)} />}
    </>
  );
}
