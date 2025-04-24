import { Mic } from 'lucide-react';
import { appConfig } from '@/lib/constant';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {

  return (
    <div className={cn("flex items-center gap-2 cursor-pointer select-none group", className)}>
      <Mic className="size-6 transition-colors duration-200 group-hover:text-pink-500" />
      <span className="flex flex-col items-center justify-center uppercase font-bold">
        {appConfig.name}
      </span>
    </div>
  );
}
