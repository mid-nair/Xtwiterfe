import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useExploreUsers } from '@/hooks/useExplore';
import { useOpenConversation } from '@/hooks/useMessages';
import { getErrorMessage } from '@/lib/apiError';

interface NewMessageModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewMessageModal({ open, onClose }: NewMessageModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { data: users, isLoading } = useExploreUsers(query);
  const openConversation = useOpenConversation();

  const startConversation = (userId: string) => {
    openConversation.mutate(userId, {
      onSuccess: (conversation) => {
        onClose();
        setQuery('');
        navigate(`/messages/${conversation.id}`);
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="New message">
      <div className="px-4 pb-4">
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search people"
          aria-label="Search people"
          className="w-full rounded-full border border-line bg-field px-4 py-2.5 text-[15px] outline-none focus:border-brand"
        />

        {openConversation.error && (
          <p role="alert" className="mt-2 text-sm text-red-500">
            {getErrorMessage(openConversation.error)}
          </p>
        )}

        <div className="mt-3 max-h-80 overflow-y-auto">
          {isLoading && <Spinner />}
          {!isLoading && query.trim() && users?.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-muted">No people found.</p>
          )}
          {!query.trim() && (
            <p className="px-2 py-6 text-center text-sm text-muted">Search for someone to message.</p>
          )}
          <ul>
            {users?.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  disabled={openConversation.isPending}
                  onClick={() => startConversation(user.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-hover disabled:opacity-60"
                >
                  <Avatar src={user.avatar_url} name={user.display_name} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1">
                      <span className="truncate font-bold">{user.display_name}</span>
                      {user.is_verified && <VerifiedBadge />}
                    </span>
                    <span className="block truncate text-[15px] text-muted">@{user.username}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
