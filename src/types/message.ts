import type { TweetAuthor } from './tweet';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  other_user: TweetAuthor;
  last_message: Message | null;
  unread_count: number;
  updated_at: string;
}
