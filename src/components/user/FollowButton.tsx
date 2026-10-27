import { Button } from '@/components/ui/Button';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { cn } from '@/lib/cn';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  size?: 'sm' | 'md';
}

export function FollowButton({ userId, isFollowing, size = 'sm' }: FollowButtonProps) {
  const { mutate, isPending } = useToggleFollow();

  return (
    <Button
      variant={isFollowing ? 'outline' : 'inverse'}
      size={size}
      disabled={isPending}
      aria-pressed={isFollowing}
      onClick={() => mutate({ userId, follow: !isFollowing })}
      className={cn('group min-w-[6.5rem]', isFollowing && 'hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500')}
    >
      {isFollowing ? (
        <>
          <span className="group-hover:hidden">Following</span>
          <span className="hidden group-hover:inline">Unfollow</span>
        </>
      ) : (
        'Follow'
      )}
    </Button>
  );
}
