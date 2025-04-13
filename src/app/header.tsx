import { NavDesktop } from '@/components/app/nav/nav-desktop';
import { NavMobile } from '@/components/app/nav/nav-mobile';
// import UserButton from '@/components/user-button';
import { GlobalPicker } from '@/components/pickers';

export function Header() {
  return (
    <div className="border-grid supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div
        className=" flex h-14 items-center max-w-[1618px] mx-auto"
        style={{ paddingLeft: '0px' }}
      >
        <NavDesktop />
        <NavMobile />
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* <CommandMenu /> */}
          </div>
          <nav className="flex items-center">
            {/* <UserButton /> */}
            <GlobalPicker />
          </nav>
        </div>
      </div>
    </div>
  );
}
