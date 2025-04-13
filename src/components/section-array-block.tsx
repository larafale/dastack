import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

interface SectionArrayBlockProps {
  title: string;
  path: string;
  data: any;
  defaultOpen?: boolean;
  emptyMessage?: string;
}

export function SectionArrayBlock({
  title,
  path,
  data,
  defaultOpen = true,
  emptyMessage = 'Aucune donnée',
}: SectionArrayBlockProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const array = path.split('.').reduce((obj, key) => obj?.[key], data);

  return (
    <Card>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start h-auto p-4"
      >
        <ChevronRight
          className={cn(
            'h-4 w-4 shrink-0 transition-transform',
            isOpen && 'rotate-90'
          )}
        />
        <span className="font-medium">{title}</span>
      </Button>
      {isOpen && (
        <div className="px-4 pb-4 pt-0">
          {array?.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1 text-sm">
              {array.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          )}
        </div>
      )}
    </Card>
  );
}
