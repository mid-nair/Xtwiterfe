import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { TweetCard } from '@/components/tweet/TweetCard';
import { TweetComposer } from '@/components/tweet/TweetComposer';
import { TweetFeed } from '@/components/tweet/TweetFeed';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import { useTweetDetail, useTweetReplies } from '@/hooks/useFeeds';
import { formatCount } from '@/lib/format';

export function TweetDetailPage() {
  const { tweetId = '' } = useParams();
  const detail = useTweetDetail(tweetId);
  const replies = useTweetReplies(tweetId);

  if (detail.isLoading) return <Spinner />;

  if (detail.isError || !detail.data) {
    return (
      <>
        <PageHeader title="Post" showBack />
        <StateMessage
          title="This post doesn't exist"
          description="It may have been deleted or the link is incorrect."
        />
      </>
    );
  }

  const { tweet, parent } = detail.data;

  return (
    <>
      <PageHeader title="Post" showBack />
      {parent && <TweetCard tweet={parent} />}
      <TweetCard tweet={tweet} detail />

      <div className="border-b border-line px-4 py-3">
        <TweetComposer replyTo={tweet} />
      </div>

      <h2 className="border-b border-line px-4 py-3 text-sm font-bold">
        {formatCount(tweet.stats.replies)} {tweet.stats.replies === 1 ? 'reply' : 'replies'}
      </h2>

      <TweetFeed
        feed={replies}
        emptyTitle="No replies yet"
        emptyDescription="Be the first to reply to this post."
      />
    </>
  );
}
