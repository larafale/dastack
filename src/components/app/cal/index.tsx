'use client';
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
  DraggedEventInfo,
  useCalendar,
} from '@/components/big-cal';
import { setHours, setMinutes, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { forwardRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Locale } from '@/lib/date';

// Create a custom LastWeekTrigger component
const CalendarLastWeekTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, date } = useCalendar();

  // Check if current date is last week
  const isLastWeek = useCallback(() => {
    const lastWeekDate = subWeeks(new Date(), 1);
    return (
      lastWeekDate.getDate() === date.getDate() &&
      lastWeekDate.getMonth() === date.getMonth() &&
      lastWeekDate.getFullYear() === date.getFullYear()
    );
  }, [date]);

  const jumpToLastWeek = useCallback(() => {
    setDate(subWeeks(new Date(), 1));
  }, [setDate]);

  return (
    <Button
      variant={isLastWeek() ? "default" : "outline"}
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToLastWeek();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarLastWeekTrigger.displayName = 'CalendarLastWeekTrigger';

// Custom TodayTrigger that shows when we're viewing today
const CustomTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, date, today } = useCalendar();

  // Check if current date is today
  const isToday = useCallback(() => {
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  }, [date, today]);

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  return (
    <Button
      variant={isToday() ? "default" : "outline"}
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CustomTodayTrigger.displayName = 'CustomTodayTrigger';

export default function ProCal() {
  const t = useTranslations('Apps.cal');
  const locale = useLocale();
  return (
    <>
      <Calendar
        locale={locale as Locale}
        hoursRange={[9, 18]}
        onEventUpdate={(event) => {
          toast.success(`Event updated: ${event.title}`);
        }}
        defaultDate={new Date()}
        events={
          [
            {
              id: '1',
              start: setMinutes(setHours(new Date(), 9), 15),
              end: setMinutes(setHours(new Date(), 10), 15),
              title: 'event A',
              color: 'pink',
            },
            {
              id: '2',
              start: setMinutes(setHours(new Date(), 11), 0),
              end: setMinutes(setHours(new Date(), 13), 0),
              title: 'event B',
              color: 'blue',
            },
            {
              id: '3',
              start: setMinutes(setHours(new Date(), 16), 15),
              end: setMinutes(setHours(new Date(), 17), 15),
              title: 'event C',
              color: 'green',
            },
          ]}
      >
        <div className="flex flex-col gap-10 py-5">
          <div className="flex flex-col md:flex-row  gap-2">
            <div className='flex-1 flex items-center justify-center lg:justify-end gap-2'>
              <CalendarViewTrigger
                className="aria-[current=true]:bg-accent"
                view="day"
              >
                {t('day')}
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="week"
                className="aria-[current=true]:bg-accent"
              >
                {t('week')}
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="month"
                className="aria-[current=true]:bg-accent"
              >
                {t('month')}
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="year"
                className="aria-[current=true]:bg-accent"
              >
                {t('year')}
              </CalendarViewTrigger>
            </div>

            <div className='flex flex-1 items-center justify-center lg:justify-start px-4 w-full'>
              <CalendarPrevTrigger className='rounded-r-none z-10'>
                <ChevronLeft size={20} />
                <span className="sr-only">Previous</span>
              </CalendarPrevTrigger>

              <CalendarCurrentDate className='flex-1 px-4 h-9 select-none max-w-[192px]' />

              <CalendarNextTrigger className='rounded-l-none z-10'>
                <ChevronRight size={20} />
                <span className="sr-only">Next</span>
              </CalendarNextTrigger>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>

          <DraggedEventInfo />
        </div>
      </Calendar>
    </>
  );
}
