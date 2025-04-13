'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DatePickerI18n = {
  today: string;
  tomorrow: string;
};

type Granularity = 'day' | 'hour' | 'minute' | 'second';

type DatePickerProps = {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  size?: string;
  placeholder?: string;
  displayFormat?: string;
  /**
   * The granularity prop allows you to control the smallest unit that is displayed by DatePicker.
   * By default, the value is `second` which shows all time inputs.
   **/
  granularity?: Granularity;
  className?: string;
  locale?: unknown;
  i18n?: DatePickerI18n;
};
// // & Pick<
// //   CalendarProps,
// //   'locale' | 'weekStartsOn' | 'showWeekNumber' | 'showOutsideDays'
// >;

export function DatePicker({
  disabled,
  displayFormat = 'PPP',
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(props.value);
  const dateLocale = props.locale || undefined;
  const [open, setOpen] = React.useState(false);

  const onChangeWrapper = (value: Date | undefined) => {
    setDate(value);
    props.onChange?.(value);
  };

  React.useEffect(() => {
    setDate(props.value);
  }, [props.value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          //@ts-ignore
          size={props.size}
          disabled={disabled}
          variant={'ghost'}
          tabIndex={0}
          className={cn(
            'group justify-between text-left font-normal field-style field-shadow',
            disabled && 'cursor-not-allowed opacity-50',
            props.className
          )}
        >
          {date ? (
            <div className="flex-1">
              {format(date, displayFormat, { locale: dateLocale })}
            </div>
          ) : (
            <span className="text-placeholder">
              {props.placeholder || 'Pick a date'}
            </span>
          )}
          {date && (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChangeWrapper(undefined);
                setOpen(false);
              }}
            >
              <X className="close-icon " />
            </div>
          )}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={dateLocale}
          autoFocus
          mode="single"
          selected={date}
          onSelect={onChangeWrapper}
        />
      </PopoverContent>
    </Popover>
  );
}
