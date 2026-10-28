import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LETTER_SENDERS } from '@/config/birthday';

interface LettersState {
  /** Usernames of the friends whose letter has already been opened on this device. */
  opened: string[];
  markOpened: (username: string) => void;
}

export const useLettersStore = create<LettersState>()(
  persist(
    (set) => ({
      opened: [],
      markOpened: (username) =>
        set((state) => (state.opened.includes(username) ? state : { opened: [...state.opened, username] })),
    }),
    { name: 'x-birthday-letters' },
  ),
);

/** How many envelopes are still sealed. Used for the little badge on the Letters tab. */
export function useUnopenedLetters(): number {
  return useLettersStore((state) => LETTER_SENDERS.filter((sender) => !state.opened.includes(sender.username)).length);
}
