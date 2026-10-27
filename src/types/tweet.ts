export type FeedType = 'for_you' | 'following';

export interface TweetAuthor {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  is_verified: boolean;
}

export interface TweetStats {
  likes: number;
  reposts: number;
  replies: number;
  bookmarks: number;
  impressions?: number;
}

export interface ViewerContext {
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
}

export interface Tweet {
  id: string;
  content: string;
  user: TweetAuthor;
  reply_to_tweet_id: string | null;
  reply_to_user: TweetAuthor | null;
  media_urls?: string[];
  stats: TweetStats;
  viewer_context: ViewerContext;
  created_at: string;
  /** Set when the tweet appears in a profile's Reposts tab. */
  reposted_by?: TweetAuthor;
}

export type ProfileTweetTab = 'posts' | 'replies' | 'media' | 'reposts';

export type EngagementAction =
  | 'LIKE'
  | 'UNLIKE'
  | 'REPOST'
  | 'UNREPOST'
  | 'BOOKMARK'
  | 'UNBOOKMARK';

export interface CreateTweetPayload {
  content: string;
  reply_to_tweet_id: string | null;
  quote_tweet_id: string | null;
  media_urls: string[];
}
