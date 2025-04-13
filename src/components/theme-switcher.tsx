'use client';

import { ComponentProps } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

type ThemeSwitcherProps = {
  className?: ComponentProps<'button'>['className'];
};

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className={className}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Moon className="dark:hidden size-4" />
      <Sun className="hidden dark:block size-4" />
    </Button>
  );
};
