/**
 * Everything for the birthday experience lives here, so the text is easy to edit.
 * The special features only switch on for the account whose username is BIRTHDAY_USERNAME.
 */
import type { User } from '@/types/user';

export const BIRTHDAY_USERNAME = 'vaishanavi';
export const BIRTHDAY_FIRST_NAME = 'Vaishanavi';
export const BIRTHDAY_AGE = 25;
/** The date of the birthday (YYYY-MM-DD, local time). */
export const BIRTHDAY_DATE = '2026-10-28';
/** How the date is shown on her profile. */
export const BIRTHDAY_LABEL = '28 Oct';
export const BIRTHDAY_SIGN = 'Scorpio';

export const isBirthdayUser = (user: Pick<User, 'username'> | null | undefined): boolean =>
  user?.username === BIRTHDAY_USERNAME;

export const CONFETTI_COLORS = ['#c26bff', '#ff4fa3', '#ffd166', '#6ee7ff', '#7cf5b0', '#ffffff'];

export const WELCOME_TITLE = `Happy ${BIRTHDAY_AGE}th Birthday, ${BIRTHDAY_FIRST_NAME}! 🎂`;
export const WELCOME_MESSAGE =
  'Somebody built you your very own X. Everything here is yours: your manifestations, your tarot, your delulu JD updates and all the people who love you. Go on, make a wish. ✨';
export const WELCOME_HINT = 'Psst: tap the X logo three times for a secret. 🤫';

export const SECRET_LETTER = [
  'Hey V 💜',
  "If you're reading this, you tapped the X logo three times, which means you check every corner and find every secret level. That is so you.",
  "I couldn't buy a present big enough, so I built you a whole website. Every post, every trend and every parody account here exists because of how much fun you are to be friends with.",
  "May this year be full of laughter, plot twists in your favour, manifestations that arrive early, and a certain couple finally getting their act together (we are still manifesting). 🍀",
  'Happy 25th. Now go make a wish.',
  '— Your favourite developer 💻',
];

// ─────────────────────────────────────────────────────────────────────────────
// Tarot
// ─────────────────────────────────────────────────────────────────────────────

export interface TarotEntry {
  name: string;
  symbol: string;
  keywords: string;
  reading: string;
}

export const TAROT_DECK: TarotEntry[] = [
  { name: 'The Fool', symbol: '🃏', keywords: 'New beginnings · Leaps', reading: 'A fresh start at 25. Leap first, the universe builds the bridge.' },
  { name: 'The Magician', symbol: '✨', keywords: 'Power · Skill', reading: 'You have every tool you need. Yes, including the ones you are procrastinating with.' },
  { name: 'The High Priestess', symbol: '🌙', keywords: 'Intuition · Secrets', reading: 'Trust your gut. It has been right about that text, that person and that playlist.' },
  { name: 'The Empress', symbol: '👑', keywords: 'Abundance · Comfort', reading: 'Abundance is arriving. Make space for it (and snacks).' },
  { name: 'The Emperor', symbol: '🏛️', keywords: 'Structure · Boss energy', reading: 'Boundaries and big boss energy. Your calendar bows to you.' },
  { name: 'The Hierophant', symbol: '📜', keywords: 'Tradition · Guidance', reading: 'Tradition meets your own rules. Light a diya, then do it your way.' },
  { name: 'The Lovers', symbol: '💞', keywords: 'Love · Choices', reading: 'Love in every form is circling you: friends, family and the ships you refuse to let sink.' },
  { name: 'The Chariot', symbol: '🏎️', keywords: 'Momentum · Willpower', reading: 'Momentum! Aim, accelerate and let the doubters eat your dust.' },
  { name: 'Strength', symbol: '🦁', keywords: 'Courage · Softness', reading: 'Soft power. Your gentleness is the flex.' },
  { name: 'The Hermit', symbol: '🕯️', keywords: 'Rest · Reflection', reading: 'A quiet evening with yoga and a playlist is not hiding. It is healing.' },
  { name: 'Wheel of Fortune', symbol: '🎡', keywords: 'Luck · Turning points', reading: 'The wheel turns in your favour. Plot twists incoming (the good kind).' },
  { name: 'Justice', symbol: '⚖️', keywords: 'Truth · Balance', reading: 'Verdict: you are right, you are loved and you owe nobody an apology. Law school would be proud.' },
  { name: 'The Hanged Man', symbol: '🙃', keywords: 'Pause · New view', reading: 'Pause. Look at it upside down. The answer is rarely where you are staring.' },
  { name: 'Death', symbol: '🦋', keywords: 'Endings · Glow-up', reading: 'Not scary, just a glow-up. An old chapter closes so a better one can start.' },
  { name: 'Temperance', symbol: '💧', keywords: 'Balance · Healing', reading: 'Balance: one part hustle, one part hydration, two parts dessert.' },
  { name: 'The Devil', symbol: '⛓️', keywords: 'Habits · Temptation', reading: 'Break a habit, not your peace. Also: log off before 2am.' },
  { name: 'The Tower', symbol: '⚡', keywords: 'Shake-ups · Clarity', reading: 'A sudden shake-up clears the way. You will land on your feet, probably in good shoes.' },
  { name: 'The Star', symbol: '⭐', keywords: 'Hope · Manifestation', reading: 'Hope, healing and manifestation at full volume. Keep wishing.' },
  { name: 'The Moon', symbol: '🌕', keywords: 'Feelings · Dreams', reading: 'Feelings are loud tonight. Journal, hydrate and do not reply to anyone until morning.' },
  { name: 'The Sun', symbol: '☀️', keywords: 'Joy · Success', reading: 'Joy, success and a birthday glow. This card practically wrote itself today.' },
  { name: 'Judgement', symbol: '📯', keywords: 'Calling · Renewal', reading: 'A calling. Say yes to the thing that scares and excites you in equal measure.' },
  { name: 'The World', symbol: '🌍', keywords: 'Completion · Celebration', reading: 'You did it. Now take a victory lap (with cake).' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Horoscope
// ─────────────────────────────────────────────────────────────────────────────

export const HOROSCOPE_LOVE = [
  'Someone is thinking about you right now. It is probably a friend who wants to send you a meme.',
  'Your heart is in a generous mood. Share the last slice with someone you love.',
  'A reunion is in the air. It may only be you and your favourite playlist, but it counts.',
  'Plot twists in love favour the patient. Keep manifesting, keep smiling.',
  'Your people are louder than your worries today. Listen to them.',
  'Romance is mostly vibes and good snacks this week. Stock up.',
];

export const HOROSCOPE_WORK = [
  'A small win arrives before lunch. Celebrate it like a promotion.',
  'Your instincts are razor sharp. Trust the first answer, then double-check the numbers.',
  'The meeting that could have been an email will, in fact, be an email. Rejoice.',
  'Someone will finally agree with the idea you suggested three weeks ago.',
  'Argue your case. The jury (a.k.a. you) is already convinced.',
  'Productivity is high when your desk has water and your playlist is on.',
];

export const HOROSCOPE_VIBE = [
  'Main character, with a soundtrack.',
  'Soft launch of a very big year.',
  'Delulu is the solulu. Proceed.',
  'Calm on the outside, glittering on the inside.',
  'Unbothered, hydrated, blessed.',
  'Slightly chaotic, completely lovable.',
];

export const LUCKY_COLOURS = ['Plum', 'Rose gold', 'Moonstone', 'Lilac', 'Midnight blue', 'Champagne'];
export const LUCKY_NUMBERS = [7, 11, 25, 28, 9, 22];

// ─────────────────────────────────────────────────────────────────────────────
// "Breaking news" ticker
// ─────────────────────────────────────────────────────────────────────────────

export const NEWS_HEADLINES = [
  `Local girl turns ${BIRTHDAY_AGE}; GDP of happiness up 300%, economists baffled`,
  'Supreme Court of Friendship rules: cake is mandatory on birthdays',
  `Markets rally as ${BIRTHDAY_SIGN} queen enters her ${BIRTHDAY_AGE}th year; vibes hit all-time high`,
  'Central Bank of Besties announces unlimited birthday liquidity',
  "Mercury declares itself 'not in retrograde today' out of respect for the birthday girl",
  'Sudarshan Kriya sessions postponed; cake takes priority',
  'Corporate sector alarmed as employee manifests a promotion, a raise and better Wi-Fi',
  'JD fan club reports record hope levels. Sources: vibes',
  'NCT Dream and ZB1 playlists hit peak streaming ahead of birthday celebrations',
  'Hydration advisory: one glass of water per slice of cake, says an unqualified expert',
  'Law school rank-2 graduate wins the argument that she deserves a second slice',
  'Weather update: 100% chance of confetti with scattered hugs',
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const MS_PER_DAY = 86_400_000;

/** A whole number that changes once per local day, for "daily" picks. */
export function dayNumber(date: Date = new Date()): number {
  return Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / MS_PER_DAY);
}

export function pickForToday<T>(items: readonly T[], offset = 0): T {
  return items[(dayNumber() + offset) % items.length]!;
}

/**
 * 0 on the birthday itself, positive afterwards ("day N of being 25"),
 * negative before it (days to go).
 */
export function daysSinceBirthday(now: Date = new Date()): number {
  const [year, month, day] = BIRTHDAY_DATE.split('-').map(Number) as [number, number, number];
  const birthday = new Date(year, month - 1, day);
  return Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - birthday.getTime()) / MS_PER_DAY);
}
