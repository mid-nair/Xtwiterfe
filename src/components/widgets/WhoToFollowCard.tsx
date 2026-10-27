import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { FollowButton } from '@/components/user/FollowButton';
import { useWhoToFollow } from '@/hooks/useSidebarData';

export function WhoToFollowCard() {
  const { data: users, isLoading, isError } = useWhoToFollow();
  if (isError || (!isLoading && !users?.length)) return null;

  return (
    <section aria-label="Who to follow" className="overflow-hidden rounded-2xl bg-card">
      <h2 className="px-4 py-3 text-xl font-extrabold">Who to follow</h2>
      {isLoading ? (
        <p className="px-4 pb-4 text-sm text-muted">Loading suggestions…</p>
      ) : (
        <ul>
          {users?.map((user) => (
            <li key={user.id} className="flex items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-hover">
              <Link to={`/${user.username}`} className="flex min-w-0 items-center gap-3">
                <Avatar src={user.avatar_url} name={user.display_name} />
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="truncate font-bold hover:underline">{user.display_name}</span>
                    {user.is_verified && <VerifiedBadge />}
                  </div>
                  <span className="text-[15px] text-muted">@{user.username}</span>
                </div>
              </Link>
              <FollowButton userId={user.id} isFollowing={user.is_following} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
