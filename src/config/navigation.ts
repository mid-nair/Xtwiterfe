import { Bell, Bookmark, Hash, Home, Mail, Sparkles, User, type LucideIcon } from 'lucide-react';

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
}

/** `birthday` adds the Memories tab, which only the birthday account gets. */
export function buildNavItems(username: string, badges: NavBadges = {}, birthday = false): NavItem[] {
  return [
    { label: 'Home', to: '/', icon: Home, end: true },
    { label: 'Explore', to: '/explore', icon: Hash },
    { label: 'Notifications', to: '/notifications', icon: Bell, badge: badges.notifications },
    { label: 'Messages', to: '/messages', icon: Mail, badge: badges.messages },
    { label: 'Bookmarks', to: '/bookmarks', icon: Bookmark },
    ...(birthday ? [{ label: 'Memories', to: '/memories', icon: Sparkles }] : []),
    { label: 'Profile', to: `/${username}`, icon: User },
  ];
}
