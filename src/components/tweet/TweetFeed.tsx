import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { TweetFeedState } from '@/hooks/useTweetFeed';
import { TweetCard } from './TweetCard';

interface TweetFeedProps {
  feed: TweetFeedState;
  emptyTitle: string;
  emptyDescription?: string;
}

export function TweetFeed({ feed, emptyTitle, emptyDescription }: TweetFeedProps) {
  const { tweets, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = feed;
  const sentinelRef = useInfiniteScroll({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onReach: () => void fetchNextPage(),
  });

  if (isLoading) return <Spinner />;

  if (isError && tweets.length === 0) {
    return (
      <StateMessage
        title="Couldn’t load posts"
        description="Something went wrong while fetching this feed."
        action={<Button onClick={() => void refetch()}>Try again</Button>}
      />
    );
  }

  if (tweets.length === 0) return <StateMessage title={emptyTitle} description={emptyDescription} />;

  return (
    <section aria-label="Posts">
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <Spinner />}
    </section>
  );
}
