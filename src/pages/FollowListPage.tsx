import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import { Tabs } from '@/components/ui/Tabs';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { FollowButton } from '@/components/user/FollowButton';
import { useConnections } from '@/hooks/useConnections';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUserProfile } from '@/hooks/useSidebarData';
import { useAuthStore } from '@/stores/authStore';
import type { ConnectionKind } from '@/types/user';

const TABS = [
    { id: 'followers', label: 'Followers' },
    { id: 'following', label: 'Following' },
] as const satisfies readonly { id: ConnectionKind; label: string }[];

const EMPTY: Record<ConnectionKind, { title: string; description: (username: string) => string }> = {
    followers: {
        title: 'No followers yet',
        description: (username) => `When someone follows @${username}, they’ll show up here.`,
    },
    following: {
        title: 'Not following anyone yet',
        description: (username) => `When @${username} follows someone, they’ll show up here.`,
    },
};

/** Shared by /:username/followers and /:username/following. */
export function FollowListPage() {
    const { username = '' } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const kind: ConnectionKind = pathname.endsWith('/following') ? 'following' : 'followers';

    const viewerId = useAuthStore((state) => state.user?.id);
    const profile = useUserProfile(username);
    const list = useConnections(username, kind);

    const sentinelRef = useInfiniteScroll({
        enabled: !!list.hasNextPage && !list.isFetchingNextPage,
        onReach: () => void list.fetchNextPage(),
    });

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
    const empty = EMPTY[kind];

    return (
        <>
            <PageHeader title={user.display_name} subtitle={`@${user.username}`} showBack>
                <Tabs
                    tabs={TABS}
                    value={kind}
                    onChange={(next) => navigate(`/${user.username}/${next}`, { replace: true })}
                />
            </PageHeader>

            {list.isLoading ? (
                <Spinner />
            ) : list.isError && list.users.length === 0 ? (
                <StateMessage
                    title="Couldn’t load this list"
                    description="Something went wrong while fetching users."
                    action={<Button onClick={() => void list.refetch()}>Try again</Button>}
                />
            ) : list.users.length === 0 ? (
                <StateMessage title={empty.title} description={empty.description(user.username)} />
            ) : (
                <section aria-label={kind === 'followers' ? 'Followers' : 'Following'}>
                    <ul>
                        {list.users.map((person) => (
                            <li
                                key={person.id}
                                className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 transition-colors hover:bg-hover"
                            >
                                <Link to={`/${person.username}`} className="flex min-w-0 flex-1 items-start gap-3">
                                    <Avatar src={person.avatar_url} name={person.display_name} />
                                    <div className="min-w-0 leading-tight">
                                        <div className="flex items-center gap-1">
                                            <span className="truncate font-bold hover:underline">{person.display_name}</span>
                                            {person.is_verified && <VerifiedBadge />}
                                        </div>
                                        <span className="block truncate text-[15px] text-muted">@{person.username}</span>
                                        {person.bio && <p className="mt-1 line-clamp-2 text-[15px]">{person.bio}</p>}
                                    </div>
                                </Link>
                                {person.id !== viewerId && (
                                    <FollowButton userId={person.id} isFollowing={person.is_following} />
                                )}
                            </li>
                        ))}
                    </ul>
                    <div ref={sentinelRef} />
                    {list.isFetchingNextPage && <Spinner />}
                </section>
            )}
        </>
    );
}
