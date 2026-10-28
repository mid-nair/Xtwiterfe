import {
  BIRTHDAY_SIGN,
  HOROSCOPE_LOVE,
  HOROSCOPE_VIBE,
  HOROSCOPE_WORK,
  LUCKY_COLOURS,
  LUCKY_NUMBERS,
  pickForToday,
} from '@/config/birthday';

const ROWS = [
  { label: 'Love 💘', items: HOROSCOPE_LOVE, offset: 0 },
  { label: 'Work ⚖️', items: HOROSCOPE_WORK, offset: 2 },
  { label: 'Vibe ✨', items: HOROSCOPE_VIBE, offset: 4 },
] as const;

/** A daily Scorpio horoscope. It changes every day but is the same all day long. */
export function HoroscopeCard() {
  return (
    <section aria-label="Daily horoscope" className="overflow-hidden rounded-2xl bg-card p-4">
      <h2 className="text-xl font-extrabold">♏ {BIRTHDAY_SIGN} today</h2>

      <dl className="mt-3 space-y-3">
        {ROWS.map(({ label, items, offset }) => (
          <div key={label}>
            <dt className="text-[13px] font-bold uppercase tracking-wide text-muted">{label}</dt>
            <dd className="text-[15px] leading-6">{pickForToday(items, offset)}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-sm text-muted">
        <span>
          Lucky colour: <strong className="text-fg">{pickForToday(LUCKY_COLOURS, 1)}</strong>
        </span>
        <span>
          Lucky number: <strong className="text-fg">{pickForToday(LUCKY_NUMBERS, 3)}</strong>
        </span>
      </p>
    </section>
  );
}
