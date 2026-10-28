import type { CSSProperties } from 'react';

const EMOJI = ['💖', '✨', '💜', '🌟', '🎂', '🔮', '💫', '🎉'];

interface LikeBurstProps {
  /** Bump this number to play the burst again. 0 renders nothing. */
  burstKey: number;
}

/** A little firework of emoji that flies out of the like button. */
export function LikeBurst({ burstKey }: LikeBurstProps) {
  if (burstKey === 0) return null;

  return (
    <span key={burstKey} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-10">
      {EMOJI.map((emoji, index) => {
        const angle = (index / EMOJI.length) * Math.PI * 2;
        const distance = 34 + (index % 3) * 12;
        const style = {
          '--dx': `${Math.round(Math.cos(angle) * distance)}px`,
          '--dy': `${Math.round(Math.sin(angle) * distance)}px`,
          animationDelay: `${(index % 4) * 30}ms`,
        } as CSSProperties;

        return (
          <span key={emoji} className="x-burst-particle absolute -translate-x-1/2 -translate-y-1/2 text-base" style={style}>
            {emoji}
          </span>
        );
      })}
    </span>
  );
}
