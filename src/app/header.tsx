import { NavDesktop } from '@/components/app/nav/nav-desktop';
import { NavMobile } from '@/components/app/nav/nav-mobile';
// import UserButton from '@/components/user-button';
import { GlobalPicker } from '@/components/pickers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github } from 'lucide-react';

export function Header() {
  return (
    <div className="border-grid supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div
        className=" flex h-14 items-center max-w-[1618px] mx-auto"
        style={{ paddingLeft: '0px' }}
      >
        <div className="hidden md:flex">
          <NavDesktop />
        </div>
        <div className='md:hidden'>
          <NavMobile />
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <nav className="flex items-center">
            {/* <UserButton /> */}
            <Link href={'https://github.com/larafale/dastack'} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="lg">
                <Github />
              </Button>
            </Link>
            <GlobalPicker />
          </nav>
        </div>
      </div>
    </div>
  );
}
