import { BarChart2, Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { useEngageTweet } from '@/hooks/useEngageTweet';
import { formatCount } from '@/lib/format';
import type { EngagementAction, Tweet } from '@/types/tweet';
import { ActionButton } from './ActionButton';

interface TweetActionsProps {
  tweet: Tweet;
  onReply: () => void;
}

export function TweetActions({ tweet, onReply }: TweetActionsProps) {
  const { mutate } = useEngageTweet();
  const { stats, viewer_context: viewer } = tweet;

  const toggle = (isActive: boolean, on: EngagementAction, off: EngagementAction) =>
    mutate({ tweetId: tweet.id, action: isActive ? off : on });

  return (
    <div className="-ml-2 mt-1 flex max-w-md items-center justify-between">
      <ActionButton icon={MessageCircle} label="Reply" tone="brand" count={stats.replies} onClick={onReply} />
      <ActionButton
        icon={Repeat2}
        label={viewer.reposted ? 'Undo repost' : 'Repost'}
        tone="repost"
        count={stats.reposts}
        active={viewer.reposted}
        onClick={() => toggle(viewer.reposted, 'REPOST', 'UNREPOST')}
      />
      <ActionButton
        icon={Heart}
        label={viewer.liked ? 'Unlike' : 'Like'}
        tone="like"
        count={stats.likes}
        active={viewer.liked}
        fillWhenActive
        onClick={() => toggle(viewer.liked, 'LIKE', 'UNLIKE')}
      />
      {stats.impressions !== undefined && (
        <span className="flex items-center gap-1 text-[13px] text-muted" title="Views">
          <BarChart2 className="size-[18px]" aria-hidden="true" />
          {formatCount(stats.impressions)}
        </span>
      )}
      <ActionButton
        icon={Bookmark}
        label={viewer.bookmarked ? 'Remove bookmark' : 'Bookmark'}
        tone="brand"
        active={viewer.bookmarked}
        fillWhenActive
        onClick={() => toggle(viewer.bookmarked, 'BOOKMARK', 'UNBOOKMARK')}
      />
    </div>
  );
}
