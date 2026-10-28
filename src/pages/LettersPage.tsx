import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LetterModal } from '@/components/birthday/LetterModal';
import { PageHeader } from '@/components/layout/PageHeader';
import { LETTER_SENDERS } from '@/config/birthday';
import { useUserTweets } from '@/hooks/useFeeds';
import { useIsBirthdayUser } from '@/hooks/useIsBirthdayUser';
import { cn } from '@/lib/cn';
import { useBirthdayStore } from '@/stores/birthdayStore';
import { useLettersStore, useUnopenedLetters } from '@/stores/lettersStore';

type Sender = (typeof LETTER_SENDERS)[number];

interface EnvelopeProps {
  sender: Sender;
  onOpen: (sender: Sender, text: string) => void;
}

/** A short teaser for the envelope card: the first sentence of the letter, trimmed. */
function previewOf(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const firstSentence = clean.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? clean;
  const base = firstSentence.length >= 20 ? firstSentence : clean;
  return base.length > 90 ? `${base.slice(0, 87).trimEnd()}...` : base;
}

/** One sealed envelope. The letter text is the friend's newest top-level post. */
function Envelope({ sender, onOpen }: EnvelopeProps) {
  const feed = useUserTweets(sender.username, 'posts');
  const opened = useLettersStore((state) => state.opened.includes(sender.username));
  // The letter is the friend's long top-level post (over 280 characters), not just any post.
  const letter = feed.tweets.find((tweet) => tweet.content.length > 280);

  if (feed.isLoading) {
    return <div aria-hidden="true" className="h-56 animate-pulse rounded-2xl bg-card" />;
  }

  // Never hide an envelope: if the letter is not in the database yet, show a clear placeholder.
  if (!letter) {
    return (
      <div
        className="relative flex h-56 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-dashed border-line px-4 text-center"
        style={{ background: `linear-gradient(160deg, ${sender.accent}55, #2a144855)` }}
      >
        <span className="text-3xl" aria-hidden="true">✍️</span>
        <span className="text-lg font-extrabold">From {sender.name}</span>
        <span className="text-sm text-muted">
          {feed.isError ? 'Could not load this letter. Please refresh.' : 'Still being written...'}
        </span>
        {/* Tiny diagnostic so a missing letter is easy to explain: how many posts the server returned. */}
        {!feed.isError && (
          <span className="mt-1 text-[11px] text-muted/70">
            (server sent {feed.tweets.length} post{feed.tweets.length === 1 ? '' : 's'}; re-run the seed with --force)
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(sender, letter.content)}
      aria-label={`${opened ? 'Reopen' : 'Open'} the letter from ${sender.name}`}
      className="group relative h-56 w-full overflow-hidden rounded-2xl border border-line text-left shadow-lg transition-transform duration-300 hover:-translate-y-1"
      style={{ background: `linear-gradient(160deg, ${sender.accent}, #2a1448)` }}
    >
      {/* Envelope flap */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[62%] bg-white/15 transition-transform duration-300 group-hover:-translate-y-1"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
      />
      {/* Wax seal */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-1/2 top-[36%] flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-2xl shadow-md transition-transform duration-300 group-hover:scale-110',
          opened ? 'bg-white/90' : 'bg-[#ff4f6d]',
        )}
      >
        {opened ? '💌' : '❤️'}
      </span>

      {/* Short teaser; the full letter opens on tap and also lives as a post on the friend's profile */}
      <span className="absolute inset-x-0 top-[62%] px-4 text-center text-sm italic leading-snug text-white/90">
        “{previewOf(letter.content)}”
      </span>

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
        <span>
          <span className="block text-sm opacity-80">From</span>
          <span className="block text-xl font-extrabold leading-tight">{sender.name}</span>
        </span>
        <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold">
          {opened ? 'Opened' : 'Tap to open ✨'}
        </span>
      </span>
    </button>
  );
}

/** Sealed letters from her friends. Only for the birthday account. */
export function LettersPage() {
  const isBirthday = useIsBirthdayUser();
  const markOpened = useLettersStore((state) => state.markOpened);
  const celebrate = useBirthdayStore((state) => state.celebrate);
  const unopened = useUnopenedLetters();
  const [active, setActive] = useState<{ sender: Sender; text: string } | null>(null);

  if (!isBirthday) return <Navigate to="/" replace />;

  const handleOpen = (sender: Sender, text: string) => {
    setActive({ sender, text });
    markOpened(sender.username);
    celebrate();
  };

  return (
    <>
      <PageHeader
        title="Letters 💌"
        subtitle={unopened > 0 ? `${unopened} still sealed` : 'All opened. Read them again whenever you need a hug.'}
      />

      <p className="px-4 pt-4 text-[15px] text-muted">
        Your people wrote you these. Tap an envelope to open it.
      </p>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {LETTER_SENDERS.map((sender) => (
          <Envelope key={sender.username} sender={sender} onOpen={handleOpen} />
        ))}
      </div>

      {active && (
        <LetterModal
          open
          onClose={() => setActive(null)}
          from={active.sender.name}
          accent={active.sender.accent}
          text={active.text}
        />
      )}
    </>
  );
}