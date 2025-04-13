import { EventGroup, TimeTable } from ".";
import { useCalendar } from "./index";
import { useMemo } from "react";
import { addDays, isToday, setHours, startOfWeek, differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { formatLocale } from "@/lib/date";
import { DropPreviewIndicator } from "./index";
import { CalendarEvent } from "./types";

const CalendarWeekView = () => {
  const {
    view,
    date,
    locale,
    events,
    hoursRange,
    draggedEvent,
    minStep = 15,
    dropPreview,
    weekStartsOn,
    onEventUpdate,
    setEvents,
    setDraggedEvent,
    setDropPreview,
  } = useCalendar();

  const [startHour, endHour] = hoursRange;

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn });
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const hours = Array.from(
        { length: endHour - startHour },
        (_, i) => setHours(day, startHour + i)
      );
      weekDates.push(hours);
    }

    return weekDates;
  }, [date, hoursRange, startHour, endHour]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  if (view !== 'week') return null;

  const handleDragOver = (e: React.DragEvent, hour: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (!draggedEvent) return;

    // Find the event being dragged
    const event = events.find(ev => ev.id === draggedEvent);
    if (!event) return;

    // Get the stored drag data if available
    let clickOffsetY = 0;
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (dragData.clickOffsetY) {
        clickOffsetY = dragData.clickOffsetY;
      }
    } catch (err) {
      // If data isn't available or parseable, continue with default behavior
    }

    // Calculate the event duration in minutes
    const duration = differenceInMinutes(event.end, event.start);

    // Get the hour cell's position and dimensions
    const cellRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    // Calculate the position where the event's top edge should be
    // by subtracting the initial click offset from the current cursor position
    const eventTopY = e.clientY - clickOffsetY;

    // Calculate event position as percentage of the cell height
    const eventTopPercent = (eventTopY - cellRect.top) / cellRect.height;

    // Convert to minutes, keeping within 0-59 range
    let minutes = Math.min(59, Math.max(0, Math.round(eventTopPercent * 60)));

    // Snap to the minStep grid
    minutes = Math.round(minutes / minStep) * minStep;

    // Check if the event would end after the maximum hour range
    const eventEndHour = hour.getHours() + Math.floor((minutes + duration) / 60);
    const eventEndMinutes = (minutes + duration) % 60;

    // If event would end after endHour, adjust the starting minutes
    if (eventEndHour > endHour || (eventEndHour === endHour && eventEndMinutes > 0)) {
      // Calculate the maximum allowed starting minutes
      const maxMinutes = 60 * (endHour - hour.getHours()) - duration;
      minutes = Math.max(0, Math.min(minutes, maxMinutes));
    }

    // Update the drop preview
    setDropPreview({
      hour,
      minutes,
      duration
    });
  };

  const handleDrop = (e: React.DragEvent, hour: Date) => {
    e.preventDefault();

    if (!draggedEvent || !dropPreview) return;

    // Find the event being dragged
    const eventIndex = events.findIndex(ev => ev.id === draggedEvent);
    if (eventIndex === -1) return;

    const event = events[eventIndex];

    // Use the snapped preview position
    const newStartDate = new Date(hour);
    newStartDate.setMinutes(dropPreview.minutes);

    // Make sure the start time is within the hours range
    if (newStartDate.getHours() < startHour) {
      newStartDate.setHours(startHour);
      newStartDate.setMinutes(0);
    }

    // Create new end time
    const newEndDate = new Date(newStartDate.getTime() + dropPreview.duration * 60000);

    // Make sure the end time is within the hours range
    if (newEndDate.getHours() > endHour ||
      (newEndDate.getHours() === endHour && newEndDate.getMinutes() > 0)) {
      newEndDate.setHours(endHour);
      newEndDate.setMinutes(0);
    }

    // Create updated event
    const updatedEvent = {
      ...event,
      start: newStartDate,
      end: newEndDate
    };

    // Update events array
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = updatedEvent;
    setEvents(updatedEvents);

    // Call callback if provided
    onEventUpdate?.(updatedEvent);

    // Clear states
    setDraggedEvent(undefined);
    setDropPreview(null);
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex z-10 mb-3">
        <div className="w-12"></div>
        {headerDays.map((date, i) => (
          <div
            key={date.toString()}
            className={cn(
              'text-center flex-1 gap-1 pb-2 text-sm text-muted-foreground flex items-center justify-center',
              [0, 6].includes(i) && 'text-muted-foreground/50'
            )}
          >
            {formatLocale(date, 'E', locale)}
            <span
              className={cn(
                'h-6 grid place-content-center',
                isToday(date) &&
                'bg-primary text-primary-foreground rounded-full size-6'
              )}
            >
              {formatLocale(date, 'd', locale)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid grid-cols-7 flex-1 py-2">
          {weekDates.map((hours, i) => {
            return (
              <div
                className={cn(
                  'h-full text-sm text-muted-foreground border-l first:border-l-0',
                  [0, 6].includes(i) && 'bg-muted/50'
                )}
                key={hours[0].toString()}
              >
                {hours.map((hour, hourIndex) => (
                  <div
                    key={hour.toString()}
                    className={cn(
                      "relative border-t",
                      hourIndex === hours.length - 1 && "border-b"
                    )}
                    onDragOver={(e) => handleDragOver(e, hour)}
                    onDrop={(e) => handleDrop(e, hour)}
                  >
                    <EventGroup hour={hour} events={events} />
                    <DropPreviewIndicator hour={hour} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarWeekView;