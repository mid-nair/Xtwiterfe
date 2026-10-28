import { PartyPopper, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BIRTHDAY_AGE, daysSinceBirthday } from '@/config/birthday';
import { useBirthdayStore } from '@/stores/birthdayStore';

function describeDay(days: number): { title: string; subtitle: string } {
  if (days === 0) {
    return { title: "🎂 It's your birthday!", subtitle: `Level ${BIRTHDAY_AGE} unlocked. Everything below is yours.` };
  }
  if (days > 0) {
    return { title: `🎉 Day ${days + 1} of being ${BIRTHDAY_AGE}`, subtitle: 'Still in your birthday era. Rules do not apply.' };
  }
  const left = Math.abs(days);
  return { title: `🎂 ${left} ${left === 1 ? 'day' : 'days'} to go`, subtitle: `Level ${BIRTHDAY_AGE} is loading...` };
}

/** The pink-and-purple card at the top of her Home feed. Works on phones, where the side panel is hidden. */
export function BirthdayBanner() {
  const openPanel = useBirthdayStore((state) => state.openPanel);
  const celebrate = useBirthdayStore((state) => state.celebrate);
  const { title, subtitle } = describeDay(daysSinceBirthday());

  return (
    <section
      aria-label="Birthday"
      className="border-b border-line bg-gradient-to-br from-brand/20 via-[#ff4fa3]/10 to-transparent px-4 py-4"
    >
      <h2 className="text-xl font-extrabold">{title}</h2>
      <p className="mt-0.5 text-[15px] text-muted">{subtitle}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => openPanel('tarot')}>
          <Sparkles className="size-4" />
          Tarot card
        </Button>
        <Button variant="outline" size="sm" onClick={() => openPanel('horoscope')}>
          <Star className="size-4" />
          Horoscope
        </Button>
        <Button variant="outline" size="sm" onClick={celebrate}>
          <PartyPopper className="size-4" />
          Confetti
        </Button>
      </div>
    </section>
  );
}
