import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { WELCOME_HINT, WELCOME_MESSAGE, WELCOME_TITLE } from '@/config/birthday';
import { useBirthdayStore } from '@/stores/birthdayStore';

interface BirthdayWelcomeProps {
  open: boolean;
  onClose: () => void;
}

/** The popup she sees the first time she signs in. */
export function BirthdayWelcome({ open, onClose }: BirthdayWelcomeProps) {
  const celebrate = useBirthdayStore((state) => state.celebrate);

  useEffect(() => {
    if (open) celebrate();
  }, [open, celebrate]);

  return (
    <Modal open={open} onClose={onClose} title="Happy birthday">
      <div className="x-pop px-6 pb-8 pt-2 text-center">
        <div aria-hidden="true" className="text-5xl">
          🎂🎉✨
        </div>
        <h2 className="mt-4 bg-gradient-to-r from-[#c26bff] via-[#ff4fa3] to-[#ffd166] bg-clip-text text-3xl font-extrabold text-transparent">
          {WELCOME_TITLE}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[17px] leading-7">{WELCOME_MESSAGE}</p>
        <p className="mt-4 text-sm text-muted">{WELCOME_HINT}</p>
        <Button size="lg" className="mt-6" onClick={onClose}>
          Let&apos;s go 🎉
        </Button>
      </div>
    </Modal>
  );
}
