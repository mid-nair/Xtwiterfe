import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { StateMessage } from '@/components/ui/StateMessage';
import {
  useConversationMessages,
  useConversations,
  useMarkConversationRead,
  useSendMessage,
} from '@/hooks/useMessages';
import { useRequiredUser } from '@/hooks/useRequiredUser';
import { cn } from '@/lib/cn';
import { formatMessageTime } from '@/lib/format';

export function ConversationPage() {
  const { conversationId = '' } = useParams();
  const user = useRequiredUser();
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const {
    messages,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useConversationMessages(conversationId);
  const markRead = useMarkConversationRead(conversationId);
  const sendMessage = useSendMessage(conversationId);

  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.id;

  const conversation = conversations?.find((item) => item.id === conversationId);
  const other = conversation?.other_user;
  const hasUnreadIncoming = messages.some(
    (message) => !message.read && message.sender_id !== user.id,
  );

  useEffect(() => {
    if (hasUnreadIncoming) markRead.mutate();
  }, [conversationId, hasUnreadIncoming]);

  useEffect(() => {
    if (lastMessageId) bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [lastMessageId]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const content = text.trim();
    if (!content || sendMessage.isPending) return;
    sendMessage.mutate(content, {
      onSuccess: () => setText(''),
    });
  };

  if (conversationsLoading || isLoading) return <Spinner />;

  if (!conversation && conversations) {
    return (
      <>
        <PageHeader title="Conversation" showBack />
        <StateMessage title="Conversation not found" description="It may have been deleted." />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={other?.display_name ?? 'Conversation'}
        subtitle={other ? `@${other.username}` : undefined}
        showBack
      />

      <section aria-label="Messages" className="flex min-h-[calc(100vh-9rem)] flex-col justify-end px-4 py-4">
        {hasNextPage && (
          <div className="mb-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              loading={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              Load earlier messages
            </Button>
          </div>
        )}

        {isError && messages.length === 0 && (
          <StateMessage title="Couldn't load messages" description="Try refreshing the page." />
        )}

        {!isError && messages.length === 0 && (
          <StateMessage
            title="No messages yet"
            description={other ? `Say hello to @${other.username}.` : 'Say hello!'}
          />
        )}

        <ol className="space-y-2">
          {messages.map((message) => {
            const own = message.sender_id === user.id;
            return (
              <li key={message.id} className={cn('flex flex-col', own ? 'items-end' : 'items-start')}>
                <div
                  className={cn(
                    'max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-[15px]',
                    own
                      ? 'rounded-br-sm bg-brand text-white'
                      : 'rounded-bl-sm bg-field text-fg',
                  )}
                >
                  {message.content}
                </div>
                <time
                  dateTime={message.created_at}
                  className="mt-1 px-1 text-[11px] text-muted"
                >
                  {formatMessageTime(message.created_at)}
                </time>
              </li>
            );
          })}
        </ol>
        <div ref={bottomRef} />
      </section>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-16 flex items-end gap-2 border-t border-line bg-bg/95 p-3 backdrop-blur sm:bottom-0"
      >
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          rows={1}
          maxLength={1000}
          placeholder="Start a new message"
          aria-label="Message"
          className="field-sizing-content max-h-32 min-h-10 flex-1 resize-none rounded-2xl bg-field px-4 py-2.5 text-[15px] outline-none placeholder:text-muted"
        />
        <IconButton
          label="Send message"
          type="submit"
          disabled={!text.trim() || sendMessage.isPending}
          className="text-brand hover:bg-brand/10 disabled:opacity-40"
        >
          <SendHorizontal className="size-5" />
        </IconButton>
      </form>
    </>
  );
}
