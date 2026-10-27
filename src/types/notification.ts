import type { TweetAuthor } from './tweet';

export type NotificationType = 'FOLLOW' | 'LIKE' | 'REPLY' | 'REPOST' | 'MENTION';

export interface AppNotification {
  id: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  actor: TweetAuthor;
  tweet: { id: string; content: string } | null;
}
