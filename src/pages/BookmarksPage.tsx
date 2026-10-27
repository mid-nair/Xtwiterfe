import { PageHeader } from '@/components/layout/PageHeader';
import { TweetFeed } from '@/components/tweet/TweetFeed';
import { useBookmarks } from '@/hooks/useFeeds';

export function BookmarksPage() {
  const feed = useBookmarks();
  return (
    <>
      <PageHeader title="Bookmarks" />
      <TweetFeed feed={feed} emptyTitle="Save posts for later" emptyDescription="Bookmark a post and it will show up here." />
    </>
  );
}
