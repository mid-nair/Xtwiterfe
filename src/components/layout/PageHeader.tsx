import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@/components/ui/IconButton';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, showBack, actions, children }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="flex min-h-[53px] items-center gap-4 px-4">
        {showBack && (
          <IconButton label="Back" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="size-5" />
          </IconButton>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold leading-6">{title}</h1>
          {subtitle && <p className="text-[13px] text-muted">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </header>
  );
}
