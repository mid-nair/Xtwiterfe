import { cn } from '@/lib/cn';

export function NavBadge({ count, className }: { count?: number; className?: string }) {
  if (!count) return null;
  return (
    <span
      className={cn(
        'inline-flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold leading-4 text-white',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
