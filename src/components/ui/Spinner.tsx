import { Loader2 } from 'lucide-react';

export function Spinner() {
  return (
    <div role="status" aria-label="Loading" className="flex justify-center p-6">
      <Loader2 className="size-6 animate-spin text-brand" />
    </div>
  );
}
