import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { LikeBurst } from '@/components/birthday/LikeBurst';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';

type Tone = 'brand' | 'repost' | 'like';

const TONES: Record<Tone, { idle: string; active: string; halo: string }> = {
  brand: { idle: 'hover:text-brand', active: 'text-brand', halo: 'group-hover:bg-brand/10' },
  repost: { idle: 'hover:text-repost', active: 'text-repost', halo: 'group-hover:bg-repost/10' },
  like: { idle: 'hover:text-like', active: 'text-like', halo: 'group-hover:bg-like/10' },
};

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  tone: Tone;
  count?: number;
  /** Omit for non-toggle actions such as reply. */
  active?: boolean;
  fillWhenActive?: boolean;
  /** Plays a little emoji firework when the action is switched on. */
  burst?: boolean;
  onClick: () => void;
}

export function ActionButton({ icon: Icon, label, tone, count, active, fillWhenActive, burst, onClick }: ActionButtonProps) {
  const styles = TONES[tone];
  const [burstKey, setBurstKey] = useState(0);

  const handleClick = () => {
    if (burst && !active) setBurstKey((key) => key + 1);
    onClick();
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={handleClick}
      className={cn('group flex items-center gap-0.5 text-[13px] transition-colors', active ? styles.active : `text-muted ${styles.idle}`)}
    >
      <span className={cn('relative rounded-full p-2 transition-colors', styles.halo)}>
        <Icon className={cn('size-[18px]', active && fillWhenActive && 'fill-current')} />
        <LikeBurst burstKey={burstKey} />
      </span>
      {count ? <span>{formatCount(count)}</span> : null}
    </button>
  );
}
