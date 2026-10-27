import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { RightPanel } from './RightPanel';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1265px] justify-center">
      <Sidebar />
      <main className="min-h-screen w-full min-w-0 max-w-[600px] border-x border-line pb-16 sm:pb-0">
        <Outlet />
      </main>
      <RightPanel />
      <MobileNav />
    </div>
  );
}
