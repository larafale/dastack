import LanguageSwitcher from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Shortcuts from '@/components/shortcuts';

export function Footer() {
  return (
    <footer className="p-4 border-t">
      <div className=" flex justify-between items-center">
        <div className="text-muted-foreground text-left text-sm leading-loose">
          © {new Date().getFullYear()}
          {' by '}
          <a
            href={'https://studio1337.tech'}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
            tabIndex={0}
          >
            studio1337.tech
          </a>
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
