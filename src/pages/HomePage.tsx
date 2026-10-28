import { useCallback, useState } from 'react';
import { BirthdayBanner } from '@/components/birthday/BirthdayBanner';
import { NewsTicker } from '@/components/birthday/NewsTicker';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { TweetComposer } from '@/components/tweet/TweetComposer';
import { TweetFeed } from '@/components/tweet/TweetFeed';
import { IconButton } from '@/components/ui/IconButton';
import { Tabs } from '@/components/ui/Tabs';
import { XLogo } from '@/components/ui/XLogo';
import { useHomeTimeline } from '@/hooks/useFeeds';
import { useIsBirthdayUser } from '@/hooks/useIsBirthdayUser';
import { useTripleTap } from '@/hooks/useTripleTap';
import { useBirthdayStore } from '@/stores/birthdayStore';
import type { FeedType } from '@/types/tweet';

const FEED_TABS = [
  { id: 'for_you', label: 'For you' },
  { id: 'following', label: 'Following' },
] as const satisfies readonly { id: FeedType; label: string }[];

export function HomePage() {
  const [feedType, setFeedType] = useState<FeedType>('for_you');
  const feed = useHomeTimeline(feedType);
  const isBirthday = useIsBirthdayUser();
  const openPanel = useBirthdayStore((state) => state.openPanel);

  // Easter egg for phones, where the sidebar logo is hidden: tap this logo three times.
  const openSecret = useCallback(() => openPanel('secret'), [openPanel]);
  const handleLogoTap = useTripleTap(openSecret);

  return (
    <>
      <PageHeader
        title="Home"
        actions={
          <>
            {isBirthday && (
              <IconButton label="X logo" onClick={handleLogoTap} className="sm:hidden">
                <XLogo className="size-5" />
              </IconButton>
            )}
            <ThemeSwitcher />
          </>
        }
      >
        <Tabs tabs={FEED_TABS} value={feedType} onChange={setFeedType} />
      </PageHeader>

      {isBirthday && (
        <>
          <NewsTicker />
          <BirthdayBanner />
        </>
      )}

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
