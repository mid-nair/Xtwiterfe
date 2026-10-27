import { useEffect, useRef } from 'react';

interface Options {
  enabled: boolean;
  onReach: () => void;
}

/** Returns a ref for a sentinel element; calls onReach when it nears the viewport. */
export function useInfiniteScroll({ enabled, onReach }: Options) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onReach();
      },
      { rootMargin: '400px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, onReach]);

  return sentinelRef;
}
