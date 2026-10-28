import { create } from 'zustand';

export type BirthdayPanel = 'welcome' | 'secret' | 'tarot' | 'horoscope';

interface BirthdayState {
  /** Which birthday popup is open, if any. */
  panel: BirthdayPanel | null;
  /** Increments every time confetti should fire. 0 means never. */
  confettiTick: number;
  openPanel: (panel: BirthdayPanel) => void;
  closePanel: () => void;
  celebrate: () => void;
}

/** Tiny shared store so the logo, the banner and the layout can trigger the same popups. */
export const useBirthdayStore = create<BirthdayState>()((set) => ({
  panel: null,
  confettiTick: 0,
  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),
  celebrate: () => set((state) => ({ confettiTick: state.confettiTick + 1 })),
}));
