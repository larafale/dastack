'use client'

import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useLocale } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';


const LanguageSwitcher = () => {
  const tags = { 'en': 'English', 'fr': 'Français' };
  const router = useRouter();
  const locale = useLocale();

  const changeLanguage = (locale: string) => {
    setCookie("NEXT_LOCALE", locale, { path: "/" });
    router.refresh(); // Reload to apply locale change
  };

  return (<DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" tabIndex={-1}>
        {locale.toUpperCase()}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {Object.keys(tags).map((locale) => (
        <DropdownMenuItem
          key={locale}
          onClick={() => {
            changeLanguage(locale);
          }}
        >
          {tags[locale as keyof typeof tags]}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>)

};

export default LanguageSwitcher;
