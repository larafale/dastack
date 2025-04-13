import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

interface SectionBlockProps {
  title: string;
  path: string;
  data: any;
  defaultOpen?: boolean;
  render: (value: any) => React.ReactNode;
}

export function SectionBlock({
  title,
  path,
  data,
  defaultOpen = true,
  render,
}: SectionBlockProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const value = path.split('.').reduce((obj, key) => obj?.[key], data);

  if (!value) return null;

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
      {isOpen && <div className="px-4 pb-4 pt-0">{render(value)}</div>}
    </Card>
  );
}
