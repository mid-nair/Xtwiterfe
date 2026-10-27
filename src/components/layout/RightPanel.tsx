import { SearchBar } from '@/components/widgets/SearchBar';
import { TrendsCard } from '@/components/widgets/TrendsCard';
import { WhoToFollowCard } from '@/components/widgets/WhoToFollowCard';

export function RightPanel() {
  return (
    <aside
      aria-label="Search and suggestions"
      className="sticky top-0 hidden h-screen w-[350px] shrink-0 flex-col gap-4 overflow-y-auto px-6 pb-6 lg:flex"
    >
      <SearchBar />
      <TrendsCard />
      <WhoToFollowCard />
    </aside>
  );
}
