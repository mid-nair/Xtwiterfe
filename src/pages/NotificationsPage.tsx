import {
  AtSign,
  Bell,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCounts,
} from '@/hooks/useNotifications';
import { cn } from '@/lib/cn';
import { formatRelativeTime } from '@/lib/format';
import type { AppNotification, NotificationType } from '@/types/notification';

const ICONS: Record<NotificationType, { icon: LucideIcon; className: string; text: string }> = {
  FOLLOW: { icon: UserPlus, className: 'text-brand', text: 'followed you' },
  LIKE: { icon: Heart, className: 'text-like', text: 'liked your post' },
  REPLY: { icon: MessageCircle, className: 'text-brand', text: 'replied to your post' },
  REPOST: { icon: Repeat2, className: 'text-repost', text: 'reposted your post' },
  MENTION: { icon: AtSign, className: 'text-purple-500', text: 'mentioned you' },
};

function notificationLink(notification: AppNotification): string {
  return notification.tweet
    ? `/tweet/${notification.tweet.id}`
    : `/${notification.actor.username}`;
}

export function NotificationsPage() {
  const { notifications, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const { notifications: unreadCount } = useUnreadCounts();
  const hasUnread = unreadCount > 0;

  const sentinelRef = useInfiniteScroll({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onReach: () => void fetchNextPage(),
  });

  return (
    <>
      <PageHeader
        title="Notifications"
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={!hasUnread || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            Mark all read
          </Button>
        }
      />

      {isLoading && <Spinner />}

      {isError && notifications.length === 0 && (
        <StateMessage
          title="Couldn't load notifications"
          description="Something went wrong while fetching your notifications."
          action={<Button onClick={() => void refetch()}>Try again</Button>}
        />
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <StateMessage
          title="Nothing to see here — yet"
          description="Likes, reposts, replies and follows will show up here."
        />
      )}

      {notifications.length > 0 && (
        <section aria-label="Notifications" className="divide-y divide-line">
          {notifications.map((notification) => {
            const meta = ICONS[notification.type];
            const Icon = meta.icon;
            return (
              <Link
                key={notification.id}
                to={notificationLink(notification)}
                onClick={() => {
                  if (!notification.read) markRead.mutate(notification.id);
                }}
                className={cn(
                  'flex gap-3 px-4 py-3 transition-colors hover:bg-hover',
                  !notification.read && 'bg-brand/5',
                )}
              >
                <div className="pt-0.5">
                  <Icon className={cn('size-7', meta.className)} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <Avatar src={notification.actor.avatar_url} name={notification.actor.display_name} size="sm" />
                  <p className="mt-1.5 leading-5">
                    <span className="font-bold">{notification.actor.display_name}</span>{' '}
                    <span className="text-muted">@{notification.actor.username}</span> {meta.text}
                  </p>
                  {notification.tweet && (
                    <p className="mt-1 line-clamp-2 text-[15px] text-muted">
                      {notification.tweet.content}
                    </p>
                  )}
                  <time
                    dateTime={notification.created_at}
                    className="mt-1 block text-[13px] text-muted"
                  >
                    {formatRelativeTime(notification.created_at)}
                  </time>
                </div>

                {!notification.read && (
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                )}
              </Link>
            );
          })}
        </section>
      )}

      <div ref={sentinelRef} />
      {isFetchingNextPage && <Spinner />}

      {!isLoading && notifications.length > 0 && !hasNextPage && (
        <p className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted">
          <Bell className="size-4" /> You're all caught up
        </p>
      )}
    </>
  );
}
