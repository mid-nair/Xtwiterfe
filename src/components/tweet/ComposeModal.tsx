import { Modal } from '@/components/ui/Modal';
import type { Tweet } from '@/types/tweet';
import { TweetComposer } from './TweetComposer';

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  replyTo?: Tweet;
}

export function ComposeModal({ open, onClose, replyTo }: ComposeModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={replyTo ? 'Reply' : 'Compose post'}>
      <div className="px-4 pb-4">
        {replyTo && (
          <div className="mb-3 border-l-2 border-line pl-3 text-sm">
            <p className="text-muted">Replying to @{replyTo.user.username}</p>
            <p className="line-clamp-3">{replyTo.content}</p>
          </div>
        )}
        <TweetComposer autoFocus replyTo={replyTo} onPosted={onClose} />
      </div>
    </Modal>
  );
}
