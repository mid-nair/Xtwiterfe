import { cn } from '@/lib/cn';

interface TabsProps<T extends string> {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}

export function Tabs<T extends string>({ tabs, value, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex">
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className="relative flex-1 py-3.5 text-[15px] transition-colors hover:bg-hover"
          >
            <span className={cn(selected ? 'font-bold' : 'font-medium text-muted')}>{tab.label}</span>
            {selected && <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-14 rounded-full bg-brand" />}
          </button>
        );
      })}
    </div>
  );
}
