import { Bell, Bookmark, Hash, Home, Mail, User, type LucideIcon } from 'lucide-react';

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

export function buildNavItems(username: string, badges: NavBadges = {}): NavItem[] {
  return [
    { label: 'Home', to: '/', icon: Home, end: true },
    { label: 'Explore', to: '/explore', icon: Hash },
    { label: 'Notifications', to: '/notifications', icon: Bell, badge: badges.notifications },
    { label: 'Messages', to: '/messages', icon: Mail, badge: badges.messages },
    { label: 'Bookmarks', to: '/bookmarks', icon: Bookmark },
    { label: 'Profile', to: `/${username}`, icon: User },
  ];
}
