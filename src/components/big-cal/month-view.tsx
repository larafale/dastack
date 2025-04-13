import { useCalendar } from '.';
import { useMemo } from 'react';
import { getDaysInMonth, generateWeekdays } from './utils';
import { cn } from '@/lib/utils';
import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { cva } from 'class-variance-authority';

const monthEventVariants = cva('size-2 rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const CalendarMonthView = () => {
  const { date, view, events, locale } = useCalendar();

  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== 'month') return null;

  return (
    <div className="flex flex-col md:px-4">
      <div className="grid grid-cols-7 gap-px sticky top-0 bg-background border-b">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              'mb-2 text-right text-sm text-muted-foreground pr-2',
              [0, 6].includes(i) && 'text-muted-foreground/50'
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-7 gap-px">
        {monthDates.map((_date) => {
          const currentEvents = events.filter((event) =>
            isSameDay(event.start, _date)
          );

          return (
            <div
              className={cn(
                'ring-1 p-2 text-sm text-muted-foreground ring-border overflow-auto',
                !isSameMonth(date, _date) && 'text-muted-foreground/50'
              )}
              key={_date.toString()}
            >
              <span
                className={cn(
                  'size-6 grid place-items-center rounded-full mb-1 sticky top-0',
                  isToday(_date) && 'bg-primary text-primary-foreground'
                )}
              >
                {format(_date, 'd')}
              </span>

              {currentEvents.map((event) => {
                return (
                  <div
                    key={event.id}
                    className="px-1 rounded text-sm flex items-center gap-1"
                  >
                    <div
                      className={cn(
                        'shrink-0',
                        monthEventVariants({ variant: event.color })
                      )}
                    ></div>
                    <span className="flex-1 truncate">{event.title}</span>
                    <time className="tabular-nums text-muted-foreground/50 text-xs">
                      {format(event.start, 'HH:mm')}
                    </time>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarMonthView;
