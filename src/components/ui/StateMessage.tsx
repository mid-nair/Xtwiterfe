import type { ReactNode } from 'react';

interface StateMessageProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Shared empty / error / not-found block. */
export function StateMessage({ title, description, action }: StateMessageProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 px-6 py-16 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
