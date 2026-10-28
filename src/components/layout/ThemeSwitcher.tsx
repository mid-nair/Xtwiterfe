import { Moon, Sparkles, Sun, SunDim } from 'lucide-react';
import { useIsBirthdayUser } from '@/hooks/useIsBirthdayUser';
import { cn } from '@/lib/cn';
import { useThemeStore, type Theme } from '@/stores/themeStore';

const OPTIONS = [
  { value: 'dark', label: 'Lights out', icon: Moon },
  { value: 'dim', label: 'Dim', icon: SunDim },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'birthday', label: 'Birthday', icon: Sparkles },
] as const satisfies readonly { value: Theme; label: string; icon: unknown }[];

export function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isBirthday = useIsBirthdayUser();

  // The birthday theme is a surprise for one account only.
  const options = isBirthday ? OPTIONS : OPTIONS.filter((option) => option.value !== 'birthday');

  return (
    <div role="group" aria-label="Theme" className="flex gap-0.5 rounded-full border border-line p-0.5">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className={cn('rounded-full p-1.5 transition-colors', theme === value ? 'bg-brand text-white' : 'text-muted hover:text-fg')}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
