import { Link } from 'react-router-dom';
import { StateMessage } from '@/components/ui/StateMessage';

export function NotFoundPage() {
  return (
    <StateMessage
      title="Page not found"
      description="The page you’re looking for doesn’t exist."
      action={<Link to="/" className="font-bold text-brand hover:underline">Go to home</Link>}
    />
  );
}
