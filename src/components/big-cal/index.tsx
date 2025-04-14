'use client';

import { Button } from '@/components/ui/button';
import { cn, cva } from '@/lib/utils';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  isSameHour,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  differenceInHours,
} from 'date-fns';

import {
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { formatLocale, Locale } from '@/lib/date';
import CalendarDayView from './day-view';
import CalendarMonthView from './month-view';
import CalendarYearView from './year-view';
import CalendarWeekView from './week-view';
import { useQueryState } from 'nuqs'
import { CalendarEvent, View } from './types';
import { useTranslations } from 'next-intl';


const dayEventVariants = cva('font-bold border-l-0 text-xs', {
  variants: {
    variant: {
      default: 'bg-muted/30 text-muted-foreground border-muted',
      blue: 'bg-blue-500/30 text-blue-600 border-blue-500',
      green: 'bg-green-500/30 text-green-600 border-green-500',
      pink: 'bg-pink-500/30 text-pink-600 border-pink-500',
      purple: 'bg-purple-500/30 text-purple-600 border-purple-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});



type DropPreview = {
  hour: Date;
  minutes: number;
  duration: number;
};

type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  setEvents: (date: CalendarEvent[]) => void;
  locale: Locale;
  t: (key: string) => string;
  enableHotkeys?: boolean;
  today: Date;
  hoursRange: [number, number];
  minStep?: number; // minutes
  minDuration?: number; // minutes
  weekStartsOn?: number;
  draggedEvent?: string;
  dropPreview: DropPreview | null;
  resizingEventId: string | null;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  setDraggedEvent: (id?: string) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  setDropPreview: (preview: DropPreview | null) => void;
  setResizingEventId: (id: string | null) => void;
};

const Context = createContext<ContextType>({} as ContextType);


type CalendarProps = {
  children: ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale: Locale;
  enableHotkeys?: boolean;
  hoursRange?: [number, number];
  minStep?: number;
  minDuration?: number;
  weekStartsOn?: number;
  className?: string;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
};

const Calendar = ({
  children,
  defaultDate = new Date(),
  enableHotkeys = true,
  view: _defaultMode = 'year',
  events: defaultEvents = [],
  hoursRange = [0, 24],
  minStep = 15,
  minDuration = 30,
  weekStartsOn = 1,
  locale = 'en',
  className,
  onEventClick,
  onChangeView,
  onEventUpdate,
}: CalendarProps) => {
  const [view, setView] = useQueryState<View>('view', {
    defaultValue: _defaultMode,
    parse: (value) => value as View,
    serialize: (value) => value,
  });

  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  const [draggedEvent, setDraggedEvent] = useState<string | undefined>(undefined);
  const [dropPreview, setDropPreview] = useState<DropPreview | null>(null);
  const [resizingEventId, setResizingEventId] = useState<string | null>(null);

  const t = useTranslations('Apps.cal');

  // Handle global drop event to reset drag state when dropped outside calendar
  useEffect(() => {
    const handleGlobalDrop = () => {
      if (draggedEvent) {
        setDraggedEvent(undefined);
        setDropPreview(null);
      }
    };

    // Add global drop handler
    window.addEventListener('dragend', handleGlobalDrop);

    return () => {
      window.removeEventListener('dragend', handleGlobalDrop);
    };
  }, [draggedEvent]);

  const changeView = (newView: View) => {
    setView(newView);
    onChangeView?.(newView);
  };

  useHotkeys('m', () => changeView('month'), {
    enabled: enableHotkeys,
  });

  useHotkeys('w', () => changeView('week'), {
    enabled: enableHotkeys,
  });

  useHotkeys('y', () => changeView('year'), {
    enabled: enableHotkeys,
  });

  useHotkeys('d', () => changeView('day'), {
    enabled: enableHotkeys,
  });

  return (
    <div className={cn(className)}>
      <Context.Provider
        value={{
          view,
          setView,
          date,
          setDate,
          events,
          setEvents,
          locale,
          t,
          enableHotkeys,
          today: new Date(),
          hoursRange,
          draggedEvent,
          minStep,
          minDuration,
          weekStartsOn,
          dropPreview,
          resizingEventId,
          onEventClick,
          onEventUpdate,
          onChangeView,
          setDraggedEvent,
          setDropPreview,
          setResizingEventId,
        }}
      >
        {children}
      </Context.Provider>
    </div>
  );
};

export const useCalendar = () => useContext(Context);

const CalendarViewTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    view: View;
  }
>(({ children, view: targetView, ...props }, ref) => {
  const { view: currentView, setView, onChangeView } = useCalendar();

  return (
    <Button
      aria-current={currentView === targetView}
      variant="ghost"
      {...props}
      ref={ref}
      tabIndex={0}
      onClick={() => {
        setView(targetView);
        onChangeView?.(targetView);
      }}
    >
      {children}
    </Button>
  );
});
CalendarViewTrigger.displayName = 'CalendarViewTrigger';

export const EventGroup = ({
  events,
  hour,
}: {
  events: CalendarEvent[];
  hour: Date;
}) => {
  const {
    setDraggedEvent,
    onEventClick,
    minStep = 15,
    hoursRange,
    draggedEvent,
    setEvents,
    events: allEvents,
    onEventUpdate,
    setDropPreview,
    setResizingEventId: contextSetResizingEventId
  } = useCalendar();

  const [startHour, endHour] = hoursRange;

  // Use refs instead of state for resize tracking to ensure values are available immediately
  const resizingRef = useRef<{
    eventId: string;
    edge: 'top' | 'bottom';
    startY: number;
    originalEvent: CalendarEvent;
  } | null>(null);

  // Track which events are being resized for UI purposes only
  const [resizingEventId, setLocalResizingEventId] = useState<string | null>(null);

  // Add ref for current resize event
  const resizingEvent = useRef<CalendarEvent | null>(null);

  // Update the context's resizingEventId when local state changes
  useEffect(() => {
    // Make sure we're using the context setter
    if (contextSetResizingEventId) {
      contextSetResizingEventId(resizingEventId);
    }
  }, [resizingEventId, contextSetResizingEventId]);

  // Update handleResizeStart to use the local setter
  const handleResizeStart = (event: CalendarEvent, edge: 'top' | 'bottom') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Store a deep copy of the original event
    resizingEvent.current = { ...event, start: new Date(event.start), end: new Date(event.end) };

    // Set resizing ref FIRST (this is immediately available to event handlers)
    resizingRef.current = {
      eventId: event.id,
      edge,
      startY: e.clientY,
      originalEvent: { ...event, start: new Date(event.start), end: new Date(event.end) }
    };

    // Then update UI state using the local setter
    setLocalResizingEventId(event.id);

    // Add document-level event listeners for more reliable tracking
    window.document.addEventListener('mousemove', handleResizeMove);
    window.document.addEventListener('mouseup', handleResizeEnd);

    // Add a class to the body to indicate we're resizing (for cursor)
    document.body.classList.add('resizing-ns-resize');
  };

  // Update handleResizeEnd to use the local setter
  const handleResizeEnd = () => {
    // Notify of event update
    if (resizingRef.current && onEventUpdate) {
      const eventIndex = allEvents.findIndex(e => e.id === resizingRef.current?.eventId);
      if (eventIndex !== -1) {
        onEventUpdate(allEvents[eventIndex]);
      }
    }

    // Clean up refs first
    resizingRef.current = null;
    resizingEvent.current = null;

    // Then update UI state using the local setter
    setLocalResizingEventId(null);

    // Clean up event listeners
    window.document.removeEventListener('mousemove', handleResizeMove);
    window.document.removeEventListener('mouseup', handleResizeEnd);
    document.body.classList.remove('resizing-ns-resize');
  };

  // Fix the visibleEvents function to handle event spanning correctly
  const visibleEvents = events.filter(event => {
    // Normal events should only appear in the hour they start in
    if (isSameHour(event.start, hour)) return true;

    // But for an event being resized, handle it differently
    if (resizingRef.current && event.id === resizingRef.current.eventId) {
      // We'll handle the resizing event specially - it should only show in the hour it starts in
      // This prevents duplicates when resizing across hours
      return isSameHour(event.start, hour);
    }

    return false;
  });

  const handleDragStart = (event: CalendarEvent) => (e: React.DragEvent) => {
    // Don't allow drag if we're resizing
    if (resizingRef.current) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    setDraggedEvent(event.id);

    // Calculate the cursor position within the event element
    const rect = e.currentTarget.getBoundingClientRect();
    const clickOffsetY = e.clientY - rect.top; // How far from the top of the event the user clicked

    // Set the initial drop preview based on the original event position
    const minutes = event.start.getMinutes();
    const duration = differenceInMinutes(event.end, event.start);

    setDropPreview({
      hour: new Date(event.start),
      minutes: minutes,
      duration: duration
    });

    // Store both the event data and the click offset for later use
    e.dataTransfer.setData('text/plain', JSON.stringify({
      originalStart: event.start.toISOString(),
      minutes: minutes,
      duration: duration,
      clickOffsetY: clickOffsetY,
      clickOffsetPercent: clickOffsetY / rect.height // Store as percentage of event height
    }));
  };

  // Handle resize movement
  const handleResizeMove = (e: MouseEvent) => {
    // Use refs directly for all operations to ensure latest values
    if (!resizingRef.current || !resizingEvent.current) {
      return;
    }

    // Get hour cell height
    const hourCell = document.querySelector('[data-hour-cell]');
    if (!hourCell) {
      return;
    }

    const cellHeight = hourCell.getBoundingClientRect().height;
    const deltaY = e.clientY - resizingRef.current.startY;

    // Convert pixels to minutes (assuming a cell is 60 minutes tall)
    const minutesDelta = Math.round(deltaY / cellHeight * 60 / minStep) * minStep;

    // Create a new copy of the event
    const updatedEvent = { ...resizingEvent.current };

    // Apply changes based on which edge we're resizing
    if (resizingRef.current.edge === 'top') {
      // Get original start
      const originalStart = new Date(resizingRef.current.originalEvent.start);

      // Calculate new start time
      const newStart = new Date(originalStart);
      newStart.setMinutes(originalStart.getMinutes() + minutesDelta);

      // Enforce minimum duration and don't allow past end time
      if (newStart < updatedEvent.end && differenceInMinutes(updatedEvent.end, newStart) >= minStep) {
        updatedEvent.start = newStart;
      }

      // Don't allow start time before the calendar start hour
      if (updatedEvent.start.getHours() < startHour) {
        updatedEvent.start = new Date(updatedEvent.start);
        updatedEvent.start.setHours(startHour);
        updatedEvent.start.setMinutes(0);
      }
    } else {
      // Get original end
      const originalEnd = new Date(resizingRef.current.originalEvent.end);

      // Calculate new end time
      const newEnd = new Date(originalEnd);
      newEnd.setMinutes(originalEnd.getMinutes() + minutesDelta);

      // Enforce minimum duration and don't allow before start time
      if (newEnd > updatedEvent.start && differenceInMinutes(newEnd, updatedEvent.start) >= minStep) {
        updatedEvent.end = newEnd;
      }

      // Don't allow end time after the calendar end hour
      if (updatedEvent.end.getHours() > endHour ||
        (updatedEvent.end.getHours() === endHour && updatedEvent.end.getMinutes() > 0)) {
        updatedEvent.end = new Date(updatedEvent.end);
        updatedEvent.end.setHours(endHour);
        updatedEvent.end.setMinutes(0);
      }
    }

    // Update the events array with the changed event
    const eventIndex = allEvents.findIndex(e => e.id === resizingRef.current?.eventId);
    if (eventIndex !== -1) {
      const updatedEvents = [...allEvents];
      updatedEvents[eventIndex] = updatedEvent;

      // Force a state update
      setEvents([...updatedEvents]);

      // Update our ref to the current state
      resizingEvent.current = updatedEvent;
    }
  };

  return (
    <div className="h-20 relative" data-hour-cell>
      {visibleEvents.map((event) => {
        // Calculate event positioning
        let startPosition = 0;

        // If event starts in this hour
        const hoursDifference = differenceInMinutes(event.end, event.start) / 60;
        const crossedHourLines = Math.ceil(hoursDifference) - 1;
        startPosition = event.start.getMinutes() / 60;

        // For height calculation, handle multi-hour events correctly
        const heightStyle = crossedHourLines > 0
          ? `calc(${hoursDifference * 100}% + ${crossedHourLines}px)`
          : `${hoursDifference * 100}%`;

        const isResizing = resizingEventId === event.id;

        const ResizeBar = ({ edge }: { edge: 'top' | 'bottom' }) => {
          return (
            <div className={cn(
              'absolute h-[2px] left-0 w-full opacity-0  hover:opacity-100 bg-primary/20 z-30 -translate-y-[1px]',
              edge === 'top' && 'top-0',
              edge === 'bottom' && 'bottom-0'
            )}>
              <div className="w-6 h-1 rounded-md bg-primary mx-auto cursor-ns-resize" onMouseDown={(e) => handleResizeStart(event, edge)(e)}></div>
            </div>
          )
        }

        return (
          <div
            key={event.id}
            className={cn(
              'absolute w-full hover:brightness-95 active:brightness-90 transition-all group',
              draggedEvent === event.id && 'opacity-0',
              isResizing && 'z-30 shadow-lg',
              // isResizing && resizingRef.current?.edge === 'top' && 'cursor-ns-resize',
              // isResizing && resizingRef.current?.edge === 'bottom' && 'cursor-ns-resize',
              dayEventVariants({
                variant: (event.color as "default" | "blue" | "green" | "pink" | "purple" | undefined)
              })
            )}
            style={{
              top: `${startPosition * 100}%`,
              height: heightStyle,
              zIndex: isResizing ? 20 : 10
            }}
            draggable={!isResizing}
            onDragStart={handleDragStart(event)}
            onClick={() => !isResizing && onEventClick?.(event)}
          >
            <ResizeBar edge="top" />

            <div className="relative z-0 pointer-events-none">
              {event.title}
            </div>

            <ResizeBar edge="bottom" />
          </div>
        );
      })}
    </div>
  );
};

export const formatEventDuration = (start: Date, end: Date): string => {
  const hours = differenceInHours(end, start);
  const minutes = differenceInMinutes(end, start) % 60;

  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}min`;
  }
};

const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const next = useCallback(() => {
    if (view === 'day') {
      setDate(addDays(date, 1));
    } else if (view === 'week') {
      setDate(addWeeks(date, 1));
    } else if (view === 'month') {
      setDate(addMonths(date, 1));
    } else if (view === 'year') {
      setDate(addYears(date, 1));
    }
  }, [date, view, setDate]);

  useHotkeys('ArrowRight', () => next(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = 'CalendarNextTrigger';

const CalendarPrevTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  useHotkeys('ArrowLeft', () => prev(), {
    enabled: enableHotkeys,
  });

  const prev = useCallback(() => {
    if (view === 'day') {
      setDate(subDays(date, 1));
    } else if (view === 'week') {
      setDate(subWeeks(date, 1));
    } else if (view === 'month') {
      setDate(subMonths(date, 1));
    } else if (view === 'year') {
      setDate(subYears(date, 1));
    }
  }, [date, view, setDate]);

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = 'CalendarPrevTrigger';

const CalendarTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, today } = useCalendar();

  useHotkeys('t', () => jumpToToday(), {
    enabled: enableHotkeys,
  });

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  return (
    <Button
      variant="outline"
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
CalendarTodayTrigger.displayName = 'CalendarTodayTrigger';

const CalendarCurrentDate = ({ className, ...props }: { className?: string } & React.HTMLAttributes<HTMLButtonElement>) => {
  const { date, locale, view } = useCalendar();
  const format = view === 'day' ? 'PPP' : view === 'week' ? 'PP' : view === 'month' ? 'MMMM' : 'yyyy';
  return (
    // <Button variant="outline" size="lg" className={cn("capitalize cursor-default", className)} {...props}>
    <span className={cn("capitalize cursor-default border-y-2 flex items-center justify-center", className)} {...props}>
      {formatLocale(date, format, locale)}
    </span>
  );
};


export const TimeTable = () => {
  const now = new Date();
  const { hoursRange } = useCalendar();
  const [startHour, endHour] = hoursRange;

  return (
    <div className="pr-2 w-12 min-h-full flex flex-col justify-between">
      {Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i).map((hour) => {
        return (
          <div
            className="text-right relative text-xs text-muted-foreground/50"
            key={hour}
          >
            {now.getHours() === hour && (
              <div
                className="absolute z- left-full w-dvw h-1 bg-red-500"
                style={{
                  top: `${(now.getMinutes() / 60) * 100}%`,
                }}
              >
                <div className="size-2 rounded-full bg-red-500 absolute left-0 "></div>
              </div>
            )}
            <p className="top-0">
              {hour === 24 ? 0 : hour}:00
            </p>
          </div>
        );
      })}
    </div>
  );
};

const DraggedEventInfo = () => {
  const { draggedEvent, events, locale, dropPreview, resizingEventId, t } = useCalendar();

  // Check if we're dragging or resizing
  const isResizing = !!resizingEventId;
  const isDragging = !!draggedEvent;

  // Return null if neither dragging nor resizing
  if (!isDragging && !isResizing) return null;

  // Find the active event (either being dragged or resized)
  const activeEventId = resizingEventId || draggedEvent;
  let event = events.find(ev => ev.id === activeEventId);

  if (!event) event = {
    id: "x",
    start: new Date(),
    end: new Date(),
    title: 'Untitled Event',
    color: 'default'
  };

  // Show preview time if available during drag
  const displayStart = (isDragging && dropPreview) ?
    (() => {
      const previewDate = new Date(dropPreview.hour);
      previewDate.setMinutes(dropPreview.minutes);
      return previewDate;
    })() :
    event.start;

  const displayEnd = (isDragging && dropPreview) ?
    (() => {
      const previewEndDate = new Date(dropPreview.hour);
      previewEndDate.setMinutes(dropPreview.minutes);
      previewEndDate.setTime(previewEndDate.getTime() + dropPreview.duration * 60000);
      return previewEndDate;
    })() :
    event.end;

  return (
    <div className="border-2 border mx-auto mt-10 rounded-md shadow-lg p-4 z-[9999] flex gap-6 text-sm max-w-fit">
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">
          {t('start')}
        </span>
        <time className="font-medium">
          {formatLocale(displayStart, 'PPP', locale)} <br />
          {formatLocale(displayStart, 'p', locale)}
        </time>
      </div>

      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">
          {t('end')}
        </span>
        <time className="font-medium">
          {formatLocale(displayEnd, 'PPP', locale)} <br />
          {formatLocale(displayEnd, 'p', locale)}
        </time>
      </div>

      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">{t('duration')}</span>
        <span className="font-medium">
          {formatEventDuration(displayStart, displayEnd)}
        </span>
      </div>
    </div>
  );
};

export const DropPreviewIndicator = ({ hour }: { hour: Date }) => {
  const { dropPreview, draggedEvent, events } = useCalendar();

  // No preview to show if no drag is happening
  if (!dropPreview || !draggedEvent) {
    return null;
  }

  // Check if this is the hour we should show the preview in
  const previewHour = dropPreview.hour;
  const showInThisHour = previewHour.getHours() === hour.getHours() &&
    previewHour.getDate() === hour.getDate() &&
    previewHour.getMonth() === hour.getMonth() &&
    previewHour.getFullYear() === hour.getFullYear();

  if (!showInThisHour) {
    return null;
  }

  const event = events.find(e => e.id === draggedEvent);
  if (!event) return null;

  const startPosition = dropPreview.minutes / 60;
  const hoursDifference = dropPreview.duration / 60;
  const crossedHourLines = Math.ceil(hoursDifference) - 1;

  // Use the same height calculation logic with border compensation
  const heightStyle = crossedHourLines > 0
    ? `calc(${hoursDifference * 100}% + ${crossedHourLines}px)`
    : `${hoursDifference * 100}%`;

  return (
    <div
      className={cn(
        'absolute w-full border-2 border-dashed bg-transparent',
        `border-${event.color || 'primary'}-500`
      )}
      style={{
        top: `${startPosition * 100}%`,
        height: heightStyle,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
};






export {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarWeekView,
  CalendarYearView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  DraggedEventInfo
};
