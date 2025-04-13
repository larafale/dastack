'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { addMonths, format, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
  placeholder?: string | false;
  locale?: unknown;
  size?: string;
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder,
  disabled,
  ...props
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  const [open, setOpen] = React.useState(false);

  const today = new Date();
  const startMonth = subMonths(today, 6);
  const endMonth = addMonths(today, 6);

  const dateLocale = props.locale || undefined;

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'ghost'}
            size={props.size}
            disabled={disabled}
            tabIndex={0}
            className={cn(
              'field-style field-shadow ',
              'group justify-between text-left font-normal '
            )}
          >
            {date?.from && (
              <div className="flex-1">
                {format(date.from, 'd MMM yyyy', { locale: dateLocale })}
                {date.to &&
                  ` - ${format(date.to, 'd MMM yyyy', { locale: dateLocale })}`}
              </div>
            )}
            {!date?.from && placeholder !== false && (
              <span className="text-placeholder">
                {placeholder || 'Pick a range'}
              </span>
            )}
            {date && (
              <div
                className="opacity-0 group-hover:opacity-50 "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDate(undefined);
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                <X className="size-4" />
              </div>
            )}
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            locale={dateLocale}
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date) => {
              setDate(date);
              onChange(date);
            }}
            numberOfMonths={2}
            startMonth={startMonth}
            endMonth={endMonth}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
