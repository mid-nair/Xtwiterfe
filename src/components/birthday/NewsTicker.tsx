import { NEWS_HEADLINES } from '@/config/birthday';

/** A scrolling "breaking news" bar. Hover to pause. */
export function NewsTicker() {
  return (
    <div
      role="region"
      aria-label="Breaking birthday news"
      className="flex items-stretch overflow-hidden border-b border-line bg-brand/10 text-sm"
    >
      <span className="z-10 shrink-0 bg-brand px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-white">
        Breaking
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="x-ticker-track flex w-max gap-12 whitespace-nowrap py-2 pl-6">
          {[...NEWS_HEADLINES, ...NEWS_HEADLINES].map((headline, index) => (
            <span key={index} aria-hidden={index >= NEWS_HEADLINES.length || undefined}>
              • {headline}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
