import type { FeedType, ProfileTweetTab } from '@/types/tweet';

export const queryKeys = {
  feeds: {
    all: ['feeds'] as const,
    home: (feedType: FeedType) => ['feeds', 'home', feedType] as const,
    homeAll: ['feeds', 'home'] as const,
    user: (username: string, tab: ProfileTweetTab = 'posts') =>
      ['feeds', 'user', username, tab] as const,
    userAll: ['feeds', 'user'] as const,
    bookmarks: ['feeds', 'bookmarks'] as const,
  },
  tweets: {
    all: ['tweets'] as const,
    detail: (tweetId: string) => ['tweets', 'detail', tweetId] as const,
    repliesAll: ['tweets', 'replies'] as const,
    replies: (tweetId: string) => ['tweets', 'replies', tweetId] as const,
  },
  users: {
    all: ['users'] as const,
    profile: (username: string) => ['users', 'profile', username] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: ['notifications', 'list'] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    list: ['conversations', 'list'] as const,
    unreadCount: ['conversations', 'unread-count'] as const,
    messages: (conversationId: string) =>
      ['conversations', 'messages', conversationId] as const,
  },
  explore: {
    all: ['explore'] as const,
    tweets: (query: string) => ['explore', 'tweets', query] as const,
    users: (query: string) => ['explore', 'users', query] as const,
  },
  suggestions: ['suggestions'] as const,
  trends: ['trends'] as const,
};
