import { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { isBirthdayUser } from '@/config/birthday';
import { useRequiredUser } from '@/hooks/useRequiredUser';
import { useBirthdayStore } from '@/stores/birthdayStore';
import { useThemeStore } from '@/stores/themeStore';
import { BirthdayWelcome } from './BirthdayWelcome';
import { Confetti } from './Confetti';
import { HoroscopeCard } from './HoroscopeCard';
import { SecretLetterModal } from './SecretLetterModal';
import { TarotCard } from './TarotCard';

function readFlag(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeFlag(key: string): void {
  try {
    localStorage.setItem(key, '1');
  } catch {
    // Storage can be blocked (private mode); the experience still works without it.
  }
}

/**
 * Mounted once inside the app layout. Everything here is inert for every account
 * except the birthday girl's.
 */
export function BirthdayRoot() {
  const user = useRequiredUser();
  const isBirthday = isBirthdayUser(user);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const panel = useBirthdayStore((state) => state.panel);
  const confettiTick = useBirthdayStore((state) => state.confettiTick);
  const openPanel = useBirthdayStore((state) => state.openPanel);
  const closePanel = useBirthdayStore((state) => state.closePanel);

  useEffect(() => {
    // Someone else on a shared device must never be stuck with the birthday theme.
    if (!isBirthday) {
      if (theme === 'birthday') setTheme('dark');
      return;
    }

    // First time on this device: switch to the birthday theme and show the welcome popup.
    const themeKey = `x-birthday-theme:${user.id}`;
    const welcomeKey = `x-birthday-welcome:${user.id}`;

    if (readFlag(themeKey) === null) {
      writeFlag(themeKey);
      setTheme('birthday');
    }
    if (readFlag(welcomeKey) === null) {
      writeFlag(welcomeKey);
      openPanel('welcome');
    }
  }, [isBirthday, user.id, theme, setTheme, openPanel]);

  if (!isBirthday) return null;

  return (
    <>
      {theme === 'birthday' && <div aria-hidden="true" className="x-sparkles pointer-events-none fixed inset-0 -z-10" />}

      {confettiTick > 0 && <Confetti key={confettiTick} />}

      <BirthdayWelcome open={panel === 'welcome'} onClose={closePanel} />
      <SecretLetterModal open={panel === 'secret'} onClose={closePanel} />

      <Modal open={panel === 'tarot'} onClose={closePanel} title="Tarot card">
        <div className="px-4 pb-4">
          <TarotCard />
        </div>
      </Modal>
      <Modal open={panel === 'horoscope'} onClose={closePanel} title="Horoscope">
        <div className="px-4 pb-4">
          <HoroscopeCard />
        </div>
      </Modal>
    </>
  );
}
