export interface User {
  id: string; // Snowflake IDs exceed Number.MAX_SAFE_INTEGER, so always strings
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  banner_url: string;
  location: string;
  website_url: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  tweet_count: number;
  created_at: string;
}

export interface ProfileUser extends User {
  is_following: boolean;
}

export interface SuggestedUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  is_verified: boolean;
  is_following: boolean;
}

export type UpdateProfilePayload = Partial<
  Pick<
    User,
    'display_name' | 'bio' | 'location' | 'website_url' | 'avatar_url' | 'banner_url'
  >
>;
