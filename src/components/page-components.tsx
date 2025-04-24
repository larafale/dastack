import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Section from '@/components/section';
import { Button } from '@/components/ui/button';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  desc?: string;
  size?: 'lg' | 'md' | 'sm';
  backHref?: string;
  backLabel?: string;
}

function PageHeader({ className, title, desc, size = 'md', backHref, backLabel }: PageHeaderProps) {
  return (
    <Section border="bottom" className=''>
      <div className={cn("flex flex-col items-start gap-1 py-1 ", {
        "py-1 md:py-5 lg:py-8": size === 'lg',
        "py-1 md:py-3 lg:py-5": size === 'md',
        "py-1 md:py-2 lg:py-3": size === 'sm',
      }, className)}>
        <div className="flex flex-col gap-4">
          {backHref && <Link href={backHref} className="flex w-fit items-center gap-1 text-muted-foreground hover:text-foreground font-bold hover:bg-muted rounded-md p-1 px-2">
            <ArrowLeft className="size-4"></ArrowLeft>
            <span className="text-sm">{backLabel || 'Back home'}</span>
          </Link>}

          <div>
            {title && <h1 className={'text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]'}>{title}</h1>}
            {desc && <p className={'text-foreground max-w-2xl text-balance text-lg font-light text-muted-foreground'}>{desc}</p>}
          </div>
        </div>
      </div>
    </Section>
  );
}


interface PageLinkProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

function PageLink({
  className,
  ...link
}: PageLinkProps) {
  return (<Link href={link.href} key={link.href}>
    <div className={cn("flex flex-col justify-between rounded-lg border p-6 shadow-sm", className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <link.icon className="size-6" />
          <h2 className="text-2xl font-bold">{link.title}</h2>
        </div>
        <p className="text-muted-foreground">{link.description}</p>
      </div>
      <div className="flex w-full items-center gap-2 pt-2 justify-end pt-4">
        <Button >
          GO <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  </Link>)
}


function PageLinks({ links }: { links: PageLinkProps[] }) {
  return (
    <div className="grid gap-3 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {links.map((link, index) => (<PageLink key={index} {...link} />))}
    </div>
  )
}



function PageContainer({
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="max-w-screen overflow-x-hidden ">
      <div style={{ minHeight: 'calc(100dvh - 57px)' }} className="grid grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0">
        <div className="col-start-1 row-span-full row-start-1 hidden border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>
        <div className="flex flex-col">
          {children}
        </div>
        <div className="row-span-full row-start-1 hidden border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>
      </div >
    </div>
  );
}

function PageBody({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (<div className={cn('page-body', className)}>{children}</div>)
}


export { PageContainer, PageBody, PageHeader, PageLinks, Section };
