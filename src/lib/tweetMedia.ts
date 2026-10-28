import type { Tweet, TweetMedia } from '@/types/tweet';

const VIDEO_EXTENSION_RE = /\.(mp4|webm|mov|m4v)(?:$|[?#])/i;

/** Fallback for older responses that only carry `media_urls`. */
export function inferMediaType(url: string): TweetMedia['type'] {
  return url.includes('/video/upload/') || VIDEO_EXTENSION_RE.test(url) ? 'video' : 'image';
}

/**
 * Prefer the typed `media` list from the API; fall back to `media_urls`
 * (typed by URL) so videos are never rendered as broken <img> tags.
 */
export function getTweetMedia(tweet: Tweet): TweetMedia[] {
  if (tweet.media && tweet.media.length > 0) return tweet.media;
  return (tweet.media_urls ?? []).map((url) => ({ url, type: inferMediaType(url) }));
}
