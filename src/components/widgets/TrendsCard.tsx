import { useTrends } from '@/hooks/useSidebarData';
import { formatCount } from '@/lib/format';

export function TrendsCard() {
  const { data: trends, isLoading, isError } = useTrends();
  if (isError || (!isLoading && !trends?.length)) return null;

  return (
    <section aria-label="What's happening" className="overflow-hidden rounded-2xl bg-card">
      <h2 className="px-4 py-3 text-xl font-extrabold">What's happening</h2>
      {isLoading ? (
        <p className="px-4 pb-4 text-sm text-muted">Loading trends…</p>
      ) : (
        <ul>
          {trends?.map((trend) => (
            <li key={trend.id} className="px-4 py-3 transition-colors hover:bg-hover">
              <p className="text-[13px] text-muted">{trend.category}</p>
              <p className="font-bold">{trend.topic}</p>
              <p className="text-[13px] text-muted">{formatCount(trend.post_count)} posts</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
