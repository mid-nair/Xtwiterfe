import { useCallback, useState } from 'react';
import { Mail, PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { NewMessageModal } from '@/components/messages/NewMessageModal';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useConversations } from '@/hooks/useMessages';
import { formatRelativeTime } from '@/lib/format';

export function MessagesPage() {
  const { data: conversations, isLoading, isError, refetch } = useConversations();
  const [composing, setComposing] = useState(false);
  const closeCompose = useCallback(() => setComposing(false), []);
  const openCompose = useCallback(() => setComposing(true), []);

  return (
    <>
      <PageHeader
        title="Messages"
        actions={
          <IconButton label="New message" onClick={openCompose} className="text-brand hover:bg-brand/10">
            <PenSquare className="size-5" />
          </IconButton>
        }
      />

      {isLoading && <Spinner />}

      {isError && (
        <StateMessage
          title="Couldn't load messages"
          description="Something went wrong while fetching your conversations."
          action={<Button onClick={() => void refetch()}>Try again</Button>}
        />
      )}

      {!isLoading && !isError && conversations?.length === 0 && (
        <StateMessage
          title="Welcome to your inbox"
          description="Start a conversation with somebody you follow."
          action={<Button onClick={openCompose}>New message</Button>}
        />
      )}

      {!!conversations?.length && (
        <section aria-label="Conversations" className="divide-y divide-line">
          {conversations.map((conversation) => {
            const other = conversation.other_user;
            const unread = conversation.unread_count > 0;
            return (
              <Link
                key={conversation.id}
                to={`/messages/${conversation.id}`}
                className="flex gap-3 px-4 py-3 transition-colors hover:bg-hover"
              >
                <Avatar src={other.avatar_url} name={other.display_name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate font-bold">{other.display_name}</span>
                    {other.is_verified && <VerifiedBadge />}
                    <span className="truncate text-[15px] text-muted">@{other.username}</span>
                    <time
                      dateTime={conversation.updated_at}
                      className="ml-auto shrink-0 text-[13px] text-muted"
                    >
                      {formatRelativeTime(conversation.updated_at)}
                    </time>
                  </div>
                  <p className={unread ? 'truncate font-semibold text-fg' : 'truncate text-muted'}>
                    {conversation.last_message?.content ?? 'No messages yet'}
                  </p>
                </div>
                {unread && (
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                )}
              </Link>
            );
          })}
        </section>
      )}

      {!isLoading && !isError && !!conversations?.length && (
        <p className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted">
          <Mail className="size-4" /> That's every conversation
        </p>
      )}

      <NewMessageModal open={composing} onClose={closeCompose} />
    </>
  );
}
