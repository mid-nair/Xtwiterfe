import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SECRET_LETTER } from '@/config/birthday';
import { useBirthdayStore } from '@/stores/birthdayStore';

interface SecretLetterModalProps {
  open: boolean;
  onClose: () => void;
}

/** The easter egg: tap the X logo three times. */
export function SecretLetterModal({ open, onClose }: SecretLetterModalProps) {
  const celebrate = useBirthdayStore((state) => state.celebrate);

  return (
    <Modal open={open} onClose={onClose} title="A secret letter">
      <div className="x-pop px-6 pb-6">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand">Secret unlocked 🔓</p>
        <div className="space-y-3 rounded-2xl border border-line bg-card p-5 text-[16px] leading-7">
          {SECRET_LETTER.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={celebrate}>
            Replay confetti 🎉
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
