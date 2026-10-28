import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TAROT_DECK, dayNumber } from '@/config/birthday';

/** A different card is waiting every day; "draw another" picks a random one. */
export function TarotCard() {
  const [index, setIndex] = useState(() => (dayNumber() + 3) % TAROT_DECK.length);
  const [revealed, setRevealed] = useState(false);
  const card = TAROT_DECK[index]!;

  const drawAnother = () => {
    let next = Math.floor(Math.random() * TAROT_DECK.length);
    if (next === index) next = (next + 1) % TAROT_DECK.length;
    setRevealed(false);
    setIndex(next);
  };

  return (
    <section aria-label="Tarot card of the day" className="overflow-hidden rounded-2xl bg-card p-4">
      <h2 className="text-xl font-extrabold">🔮 Your tarot card</h2>

      <div className="mt-3 flex justify-center [perspective:900px]">
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={revealed}
          aria-label={revealed ? `${card.name} card` : 'Tap to reveal your tarot card'}
          className="relative h-56 w-40 cursor-pointer rounded-xl disabled:cursor-default"
        >
          <span
            className="absolute inset-0 block transition-transform duration-700"
            style={{ transformStyle: 'preserve-3d', transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Card back */}
            <span
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-brand/60 bg-gradient-to-br from-[#3b1d6e] via-[#241042] to-[#5a1f6b] text-white shadow-lg"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span aria-hidden="true" className="text-4xl">
                ✦
              </span>
              <span className="text-sm font-bold tracking-wide">Tap to reveal</span>
            </span>

            {/* Card face */}
            <span
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-[#ffd166] bg-gradient-to-b from-[#fff3d6] to-[#ffe0f0] p-3 text-center text-[#2b1448] shadow-lg"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span aria-hidden="true" className="text-5xl">
                {card.symbol}
              </span>
              <span className="text-base font-extrabold leading-tight">{card.name}</span>
              <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{card.keywords}</span>
            </span>
          </span>
        </button>
      </div>

      <div className="mt-3 min-h-[3.5rem] text-center">
        {revealed ? (
          <>
            <p className="text-[15px] leading-6">{card.reading}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={drawAnother}>
              Draw another card
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted">Take a breath, think of a wish, then tap the card.</p>
        )}
      </div>
    </section>
  );
}
