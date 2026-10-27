import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';

export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error';

  return (
    <StateMessage
      title="Something went wrong"
      description={message}
      action={<Button onClick={() => window.location.assign('/')}>Back to home</Button>}
    />
  );
}
