import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { TweetComposer } from '@/components/tweet/TweetComposer';
import { TweetFeed } from '@/components/tweet/TweetFeed';
import { Tabs } from '@/components/ui/Tabs';
import { useHomeTimeline } from '@/hooks/useFeeds';
import type { FeedType } from '@/types/tweet';

const FEED_TABS = [
  { id: 'for_you', label: 'For you' },
  { id: 'following', label: 'Following' },
] as const satisfies readonly { id: FeedType; label: string }[];

export function HomePage() {
  const [feedType, setFeedType] = useState<FeedType>('for_you');
  const feed = useHomeTimeline(feedType);

  return (
    <>
      <PageHeader title="Home" actions={<ThemeSwitcher />}>
        <Tabs tabs={FEED_TABS} value={feedType} onChange={setFeedType} />
      </PageHeader>

      <div className="border-b border-line p-4">
        <TweetComposer />
      </div>

      <TweetFeed
        feed={feed}
        emptyTitle={feedType === 'following' ? 'Nothing here yet' : 'No posts yet'}
        emptyDescription={
          feedType === 'following' ? 'Follow people to see their posts in this feed.' : 'Be the first to post something.'
        }
      />
    </>
  );
}
