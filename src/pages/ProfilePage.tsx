import { useParams, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { TweetFeed } from '@/components/tweet/TweetFeed';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import { Tabs } from '@/components/ui/Tabs';
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { useUserTweets } from '@/hooks/useFeeds';
import { useUserProfile } from '@/hooks/useSidebarData';
import { formatCount } from '@/lib/format';
import type { ProfileTweetTab } from '@/types/tweet';

const TABS = [
  { id: 'posts', label: 'Posts' },
  { id: 'replies', label: 'Replies' },
  { id: 'media', label: 'Media' },
  { id: 'reposts', label: 'Reposts' },
] as const satisfies readonly { id: ProfileTweetTab; label: string }[];

const VALID_TABS = new Set<string>(TABS.map((tab) => tab.id));

const EMPTY_STATES: Record<ProfileTweetTab, { title: string; description: (username: string) => string }> = {
  posts: {
    title: 'No posts yet',
    description: (username) => `@${username} hasn't posted anything.`,
  },
  replies: {
    title: 'No replies yet',
    description: (username) => `@${username} hasn't replied to anything.`,
  },
  media: {
    title: 'No photos or videos yet',
    description: (username) => `When @${username} posts media, it will show up here.`,
  },
  reposts: {
    title: 'No reposts yet',
    description: (username) => `@${username} hasn't reposted anything.`,
  },
};

export function ProfilePage() {
  const { username = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') ?? 'posts';
  const tab: ProfileTweetTab = VALID_TABS.has(tabParam) ? (tabParam as ProfileTweetTab) : 'posts';

  const profile = useUserProfile(username);
  const feed = useUserTweets(username, tab);

  if (profile.isLoading) return <Spinner />;

  if (!profile.data) {
    return (
      <>
        <PageHeader title="Profile" showBack />
        <StateMessage title="This account doesn't exist" description="Try searching for another one." />
      </>
    );
  }

  const user = profile.data;
  const empty = EMPTY_STATES[tab];

  return (
    <>
      <PageHeader title={user.display_name} subtitle={`${formatCount(user.tweet_count)} posts`} showBack />
      <ProfileHeader user={user} />
      <div className="border-b border-line">
        <Tabs
          tabs={TABS}
          value={tab}
          onChange={(nextTab) =>
            setSearchParams(nextTab === 'posts' ? {} : { tab: nextTab }, { replace: true })
          }
        />
      </div>
      <TweetFeed
        feed={feed}
        emptyTitle={empty.title}
        emptyDescription={empty.description(user.username)}
      />
    </>
  );
}
