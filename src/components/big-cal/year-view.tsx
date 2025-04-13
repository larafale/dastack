import { isSameDay } from 'date-fns';
import { getMonth } from 'date-fns';
import { useCalendar } from './index';
import { useMemo } from 'react';
import { setMonth } from 'date-fns';
import { getDaysInMonth, generateWeekdays } from './utils';
import { cn, ucfirst } from '@/lib/utils';
import { formatLocale } from '@/lib/date';

const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();

  const months = useMemo(() => {
    if (!view) {
      return [];
    }

    return Array.from({ length: 12 }).map((_, i) => {
      const monthDate = setMonth(new Date(date.getFullYear(), i, 1), i);
      return {
        monthDate,
        days: getDaysInMonth(monthDate),
      };
    });
  }, [date, view]);

  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== 'year') return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4 md:px-4">
      {months.map(({ monthDate, days }, i) => (
        <div
          key={monthDate.toString()}
          className="p-2 border-t md:border md:rounded-md"
        >
          <span className="ms-2">
            {ucfirst(formatLocale(monthDate, 'MMMM', locale))}
          </span>

          <div className="grid grid-cols-7 gap-2 mt-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid gap-x-2 text-center grid-cols-7 text-xs tabular-nums">
            {days.map((_date) => (
              <YearDay
                key={_date.toString()}
                date={_date}
                isCurrentMonth={getMonth(_date) === i}
                isToday={isSameDay(today, _date)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const YearDay = ({
  date,
  isCurrentMonth,
  isToday,
}: {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}) => {
  return (
    <div className={cn('relative ', !isCurrentMonth && 'opacity-0')}>
      <div
        className={cn(
          'aspect-square grid place-content-center size-full tabular-nums rounded-full transition-colors cursor-pointer',
          'hover:bg-muted/70',
          isToday &&
          isCurrentMonth &&
          'bg-primary text-primary-foreground hover:bg-primary/90'
        )}
      >
        {formatLocale(date, 'd')}
      </div>
    </div>
  );
};

export default CalendarYearView;
