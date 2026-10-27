import { useCallback, useState } from 'react';
import { Feather, LogOut } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { ComposeModal } from '@/components/tweet/ComposeModal';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { XLogo } from '@/components/ui/XLogo';
import { buildNavItems } from '@/config/navigation';
import { useLogout } from '@/hooks/useAuth';
import { useUnreadCounts } from '@/hooks/useNotifications';
import { useRequiredUser } from '@/hooks/useRequiredUser';
import { cn } from '@/lib/cn';
import { NavBadge } from './NavBadge';

export function Sidebar() {
  const user = useRequiredUser();
  const logout = useLogout();
  const unread = useUnreadCounts();
  const [composing, setComposing] = useState(false);
  const closeCompose = useCallback(() => setComposing(false), []);

  return (
    <header className="sticky top-0 hidden h-screen w-20 shrink-0 flex-col justify-between px-2 py-3 sm:flex xl:w-64">
      <div className="flex flex-col items-center gap-1 xl:items-stretch">
        <Link to="/" aria-label="Home" className="mb-1 w-fit rounded-full p-3 transition-colors hover:bg-hover">
          <XLogo className="size-7" />
        </Link>

        <nav aria-label="Primary" className="flex flex-col items-center gap-1 xl:items-stretch">
          {buildNavItems(user.username, unread).map(({ label, to, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={badge ? `${label}, ${badge} unread` : label}
              className={({ isActive }) =>
                cn('flex w-fit items-center gap-5 rounded-full p-3 text-xl transition-colors hover:bg-hover xl:w-full xl:pr-6', isActive ? 'font-bold' : 'font-normal')
              }
            >
              <span className="relative">
                <Icon className="size-[26px]" />
                <NavBadge count={badge} className="absolute -right-2 -top-1 xl:hidden" />
              </span>
              <span className="hidden xl:inline">{label}</span>
              <NavBadge count={badge} className="ml-auto hidden xl:inline-flex" />
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setComposing(true)}
          aria-label="Post"
          className="mt-3 flex size-12 items-center justify-center rounded-full bg-brand font-bold text-white transition-colors hover:bg-brand-hover xl:h-[52px] xl:w-full"
        >
          <Feather className="size-6 xl:hidden" />
          <span className="hidden text-[17px] xl:inline">Post</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-1 xl:flex-row xl:justify-between xl:rounded-full xl:p-2 xl:hover:bg-hover">
        <Link to={`/${user.username}`} className="flex min-w-0 items-center gap-3">
          <Avatar src={user.avatar_url} name={user.display_name} />
          <div className="hidden min-w-0 leading-tight xl:block">
            <div className="flex items-center gap-1">
              <span className="truncate text-[15px] font-bold">{user.display_name}</span>
              {user.is_verified && <VerifiedBadge />}
            </div>
            <span className="text-[15px] text-muted">@{user.username}</span>
          </div>
        </Link>
        <IconButton label="Log out" onClick={logout} className="text-muted hover:text-fg">
          <LogOut className="size-[18px]" />
        </IconButton>
      </div>

      <ComposeModal open={composing} onClose={closeCompose} />
    </header>
  );
}
