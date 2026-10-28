import { useCallback, useRef } from 'react';

/**
 * Returns a click handler that calls `onTriple` when it is clicked three times
 * within `windowMs`. Works with taps on touch screens too.
 */
export function useTripleTap(onTriple: () => void, windowMs = 1200) {
  const taps = useRef<number[]>([]);

  return useCallback(() => {
    const now = Date.now();
    taps.current = [...taps.current.filter((time) => now - time < windowMs), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      onTriple();
    }
  }, [onTriple, windowMs]);
}
