import LanguageSwitcher from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Shortcuts from '@/components/shortcuts';
import { Heart } from 'lucide-react';


export function Footer() {
  return (
    <footer className="p-4 border-t">
      <div className=" flex justify-between items-center">
        <div className="text-muted-foreground text-left text-sm leading-loose">
          <div className="flex items-center gap-1 group">
            {new Date().getFullYear()}
            <Heart className="size-4 group-hover:text-brand" />
            <a
              href={'https://dastack.dev'}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
              tabIndex={0}
            >
              dastack.dev
            </a>
          </div>
        </div>
        <div className="flex gap-1 items-center">

          <ThemeSwitcher />
          <Shortcuts button trigger="edit" />
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
