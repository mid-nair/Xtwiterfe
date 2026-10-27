const compactNumber = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const joinFormat = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
const shortDate = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
const fullDateTime = new Intl.DateTimeFormat('en', {
  hour: 'numeric',
  minute: '2-digit',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const messageTime = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' });

export const formatCount = (value: number): string => compactNumber.format(value);

export const formatJoinDate = (iso: string): string => joinFormat.format(new Date(iso));

export const formatFullDateTime = (iso: string): string => fullDateTime.format(new Date(iso));

export const formatMessageTime = (iso: string): string => messageTime.format(new Date(iso));

/** "now", "5m", "3h", "2d", then "Mar 24". */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return seconds < 5 ? 'now' : `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 7 * 86_400) return `${Math.floor(seconds / 86_400)}d`;
  return shortDate.format(new Date(iso));
}
