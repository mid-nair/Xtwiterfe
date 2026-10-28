import { Bell, Bookmark, Hash, Home, Mail, MailOpen, Sparkles, User, type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: number;
}

interface NavBadges {
  notifications?: number;
  messages?: number;
  /** Sealed letters (birthday account only). */
  letters?: number;
}

interface NavOptions {
  /** Adds the Memories and Letters tabs, which only the birthday account gets. */
  birthday?: boolean;
  /** Phone layout: the bottom bar is too narrow for Letters, which lives on the Home banner instead. */
  compact?: boolean;
}

export function buildNavItems(username: string, badges: NavBadges = {}, options: NavOptions = {}): NavItem[] {
  const { birthday = false, compact = false } = options;

  return [
    { label: 'Home', to: '/', icon: Home, end: true },
    { label: 'Explore', to: '/explore', icon: Hash },
    { label: 'Notifications', to: '/notifications', icon: Bell, badge: badges.notifications },
    { label: 'Messages', to: '/messages', icon: Mail, badge: badges.messages },
    { label: 'Bookmarks', to: '/bookmarks', icon: Bookmark },
    ...(birthday ? [{ label: 'Memories', to: '/memories', icon: Sparkles }] : []),
    ...(birthday && !compact ? [{ label: 'Letters', to: '/letters', icon: MailOpen, badge: badges.letters }] : []),
    { label: 'Profile', to: `/${username}`, icon: User },
  ];
}
