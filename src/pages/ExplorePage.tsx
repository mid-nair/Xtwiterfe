import { useEffect, useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { TweetFeed } from '@/components/tweet/TweetFeed';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import { Tabs } from '@/components/ui/Tabs';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { FollowButton } from '@/components/user/FollowButton';
import { useExploreTweets, useExploreUsers } from '@/hooks/useExplore';
import { useTrends, useWhoToFollow } from '@/hooks/useSidebarData';
import { formatCount } from '@/lib/format';

type SearchTab = 'posts' | 'people';

const TABS = [
  { id: 'posts', label: 'Posts' },
  { id: 'people', label: 'People' },
] as const satisfies readonly { id: SearchTab; label: string }[];

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [input, setInput] = useState(query);
  const [tab, setTab] = useState<SearchTab>('posts');

  const tweets = useExploreTweets(query);
  const users = useExploreUsers(query);
  const trends = useTrends();
  const whoToFollow = useWhoToFollow();

  useEffect(() => setInput(query), [query]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  return (
    <>
      <PageHeader title="Explore">
        <form role="search" onSubmit={handleSubmit} className="px-4 pb-3">
          <label className="flex items-center gap-3 rounded-full border border-transparent bg-field px-4 py-2.5 focus-within:border-brand focus-within:bg-transparent">
            <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Search posts and people"
              aria-label="Search posts and people"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
          </label>
        </form>
      </PageHeader>

      {query && (
        <div className="border-b border-line">
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
        </div>
      )}

      {!query && (
        <>
          <section aria-label="Trending" className="border-b border-line">
            <h2 className="px-4 py-3 text-xl font-extrabold">Trending now</h2>
            {trends.isLoading && <Spinner />}
            <ul>
              {trends.data?.map((trend) => (
                <li key={trend.id}>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ q: trend.topic })}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-hover"
                  >
                    <p className="text-[13px] text-muted">{trend.category}</p>
                    <p className="font-bold">{trend.topic}</p>
                    <p className="text-[13px] text-muted">{formatCount(trend.post_count)} posts</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {!!whoToFollow.data?.length && (
            <section aria-label="Who to follow">
              <h2 className="px-4 py-3 text-xl font-extrabold">Who to follow</h2>
              <ul>
                {whoToFollow.data.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-hover"
                  >
                    <Link to={`/${user.username}`} className="flex min-w-0 items-center gap-3">
                      <Avatar src={user.avatar_url} name={user.display_name} />
                      <span className="min-w-0 leading-tight">
                        <span className="flex items-center gap-1">
                          <span className="truncate font-bold">{user.display_name}</span>
                          {user.is_verified && <VerifiedBadge />}
                        </span>
                        <span className="block truncate text-[15px] text-muted">@{user.username}</span>
                      </span>
                    </Link>
                    <FollowButton userId={user.id} isFollowing={user.is_following} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {!!query && tab === 'posts' && (
        <TweetFeed
          feed={tweets}
          emptyTitle="No posts found"
          emptyDescription={`Nothing matched "${query}". Try a different search.`}
        />
      )}

      {!!query && tab === 'people' && (
        <>
          {users.isLoading && <Spinner />}
          {!users.isLoading && users.data?.length === 0 && (
            <StateMessage
              title="No people found"
              description={`Nobody matched "${query}". Try a different search.`}
            />
          )}
          {!!users.data?.length && (
            <ul className="divide-y divide-line">
              {users.data.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-hover"
                >
                  <Link to={`/${user.username}`} className="flex min-w-0 items-center gap-3">
                    <Avatar src={user.avatar_url} name={user.display_name} />
                    <span className="min-w-0 leading-tight">
                      <span className="flex items-center gap-1">
                        <span className="truncate font-bold">{user.display_name}</span>
                        {user.is_verified && <VerifiedBadge />}
                      </span>
                      <span className="block truncate text-[15px] text-muted">@{user.username}</span>
                    </span>
                  </Link>
                  <FollowButton userId={user.id} isFollowing={user.is_following} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
