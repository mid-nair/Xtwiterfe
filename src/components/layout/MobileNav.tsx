import { NavLink } from 'react-router-dom';
import { buildNavItems } from '@/config/navigation';
import { useUnreadCounts } from '@/hooks/useNotifications';
import { useRequiredUser } from '@/hooks/useRequiredUser';
import { cn } from '@/lib/cn';
import { NavBadge } from './NavBadge';

export function MobileNav() {
  const { username } = useRequiredUser();
  const unread = useUnreadCounts();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
    >
      {buildNavItems(username, unread).map(({ label, to, icon: Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={badge ? `${label}, ${badge} unread` : label}
          className={({ isActive }) => cn('p-3.5 transition-colors', isActive ? 'text-fg' : 'text-muted')}
        >
          <span className="relative block">
            <Icon className="size-6" />
            <NavBadge count={badge} className="absolute -right-2.5 -top-1.5" />
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
