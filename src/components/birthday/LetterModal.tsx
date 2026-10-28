import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BIRTHDAY_FIRST_NAME } from '@/config/birthday';

interface LetterModalProps {
  open: boolean;
  onClose: () => void;
  /** Who the letter is from, e.g. "Neha". */
  from: string;
  accent: string;
  text: string;
}

/** An opened letter, shown on cream paper with a handwriting font. */
export function LetterModal({ open, onClose, from, accent, text }: LetterModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={`Letter from ${from}`}>
      <div className="x-pop px-4 pb-5">
        <div
          className="rounded-2xl border-t-8 p-5 shadow-xl"
          style={{ backgroundColor: '#fff8ee', color: '#3a2a1a', borderTopColor: accent }}
        >
          <p
            className="mb-3 text-2xl font-bold"
            style={{ fontFamily: "'Caveat', 'Segoe Script', 'Bradley Hand', cursive" }}
          >
            Dear {BIRTHDAY_FIRST_NAME},
          </p>

          <div
            className="max-h-[50vh] overflow-y-auto pr-1 text-[22px] leading-8"
            style={{ fontFamily: "'Caveat', 'Segoe Script', 'Bradley Hand', cursive", whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
          >
            {text}
          </div>

          <p
            className="mt-4 text-right text-2xl font-bold"
            style={{ fontFamily: "'Caveat', 'Segoe Script', 'Bradley Hand', cursive", color: accent }}
          >
            With love, {from} 💜
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
