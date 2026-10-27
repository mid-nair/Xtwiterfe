import type { ReactNode } from 'react';
import { XLogo } from '@/components/ui/XLogo';

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, children, footer }: AuthLayoutProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <XLogo className="mb-8 size-10" />
      <h1 className="mb-6 text-3xl font-extrabold">{title}</h1>
      {children}
      <p className="mt-8 text-[15px] text-muted">{footer}</p>
    </main>
  );
}
