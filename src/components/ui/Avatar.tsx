import { useState } from 'react';
import { cn } from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  name: string;
  size?: Size;
  className?: string;
}

const SIZES: Record<Size, string> = { sm: 'size-8', md: 'size-10', lg: 'size-12', xl: 'size-28 sm:size-32' };

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-full bg-field font-bold text-muted',
          SIZES[size],
          className,
        )}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('shrink-0 rounded-full object-cover', SIZES[size], className)}
    />
  );
}
