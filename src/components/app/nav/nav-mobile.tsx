'use client';

import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Modal from '@/components/modal';
import { X } from 'lucide-react';
import Logo from '@/components/logo';
import { mainItems, MenuItem } from './nav-data';

export function NavMobile() {
  const [open, setOpen] = React.useState(false);


  return (<div className='md:hidden ps-1'>
    <div onClick={() => setOpen(true)} >
      <Logo className="scale-[0.8]" />
    </div>
    <Modal
      mode="sheet"
      open={open}
      onClose={() => setOpen(false)}
      className='p-2 bg-muted'
    >
      <div className='flex items-center justify-between'>
        <Button variant='ghost' onClick={() => setOpen(false)}>
          <X />
        </Button>
        <Link href="/pro" onClick={() => setOpen(false)}>
          <Logo className='scale-[0.8]' />
        </Link>
      </div>
      <div className='flex flex-col gap-4 mt-10'>
        {mainItems.map((item, i) => (
          <NavLink
            key={i}
            href={item.href}
            onClick={() => setOpen(false)}
            item={item}
          />
        ))}
      </div>
    </Modal>
  </div>)
}


interface NavLinkProps extends LinkProps {
  className?: string;
  item: MenuItem;
}

function NavLink({
  item,
  ...props
}: NavLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ",
        "hover:bg-background hover:text-accent-foreground",
        "focus-visible:bg-background focus-visible:text-accent-foreground",
      )}
    >
      <div className="group flex flex-col">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium leading-none">{item.label}</div>
          {item.icon && <item.icon className="size-6 text-muted-foreground group-focus-visible:text-pink-500 group-hover:text-pink-500" />}
        </div>
      </div>
    </Link>
  );
}
