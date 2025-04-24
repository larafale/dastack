import { appConfig } from '@/lib/constant';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {

  return (
    <div className={cn("flex items-center gap-2 cursor-pointer select-none group", className)}>
      <Layers className="size-6 transition-colors duration-200 group-hover:text-pink-500" />
      <span className="flex flex-col items-center justify-center uppercase font-bold">
        {appConfig.name}
      </span>
    </div>
  );
}
