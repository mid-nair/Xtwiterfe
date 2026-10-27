import { Calendar, Link2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useOpenConversation } from '@/hooks/useMessages';
import { useAuthStore } from '@/stores/authStore';
import { getErrorMessage } from '@/lib/apiError';
import { formatCount, formatJoinDate } from '@/lib/format';
import type { ProfileUser } from '@/types/user';
import { FollowButton } from './FollowButton';

export function ProfileHeader({ user }: { user: ProfileUser }) {
  const isSelf = useAuthStore((state) => state.user?.id === user.id);
  const navigate = useNavigate();
  const openConversation = useOpenConversation();

  const handleMessage = () => {
    openConversation.mutate(user.id, {
      onSuccess: (conversation) => navigate(`/messages/${conversation.id}`),
    });
  };

  return (
    <section aria-label="Profile" className="border-b border-line">
      <div className="h-32 bg-field sm:h-48">
        {user.banner_url && <img src={user.banner_url} alt="" className="size-full object-cover" />}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-start justify-between">
          <Avatar src={user.avatar_url} name={user.display_name} size="xl" className="-mt-14 border-4 border-bg sm:-mt-16" />
          <div className="flex gap-2 pt-3">
            {isSelf ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/settings/profile')}>
                Edit profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  loading={openConversation.isPending}
                  onClick={handleMessage}
                >
                  Message
                </Button>
                <FollowButton userId={user.id} isFollowing={user.is_following} size="sm" />
              </>
            )}
          </div>
        </div>

        {openConversation.error && (
          <p role="alert" className="mt-2 text-sm text-red-500">
            {getErrorMessage(openConversation.error)}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1">
          <h2 className="text-xl font-extrabold">{user.display_name}</h2>
          {user.is_verified && <VerifiedBadge />}
        </div>
        <p className="text-muted">@{user.username}</p>

        {user.bio && <p className="mt-3 whitespace-pre-wrap">{user.bio}</p>}

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-muted">
          {user.location && (
            <li className="flex items-center gap-1"><MapPin className="size-4" />{user.location}</li>
          )}
          {user.website_url && (
            <li className="flex items-center gap-1">
              <Link2 className="size-4" />
              <a href={user.website_url} target="_blank" rel="noopener noreferrer nofollow" className="text-brand hover:underline">
                {user.website_url.replace(/^https?:\/\//, '')}
              </a>
            </li>
          )}
          <li className="flex items-center gap-1"><Calendar className="size-4" />Joined {formatJoinDate(user.created_at)}</li>
        </ul>

        <p className="mt-3 flex gap-5 text-[15px] text-muted">
          <span><strong className="text-fg">{formatCount(user.following_count)}</strong> Following</span>
          <span><strong className="text-fg">{formatCount(user.follower_count)}</strong> Followers</span>
        </p>
      </div>
    </section>
  );
}
