import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 'birthday' is only offered to (and applied for) the birthday account. */
export type Theme = 'dark' | 'dim' | 'light' | 'birthday';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist((set) => ({ theme: 'dark', setTheme: (theme) => set({ theme }) }), { name: 'x-theme' }),
);
