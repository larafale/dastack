import { setHours, setMinutes, addMinutes, differenceInMinutes } from "date-fns";
import { EventGroup, TimeTable, useCalendar } from "./index";
import { cn } from "@/lib/utils";
import { type CalendarEvent } from "./types";
import { DropPreviewIndicator } from "./index";

const CalendarDayView = () => {
  const {
    view,
    events,
    date,
    hoursRange,
    draggedEvent,
    setDraggedEvent,
    minStep = 15,
    setEvents,
    onEventUpdate,
    dropPreview,
    setDropPreview
  } = useCalendar();

  const [startHour, endHour] = hoursRange;

  if (view !== 'day') return null;

  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => setHours(date, startHour + i)
  );

  const calculateSnappedMinutes = (element: HTMLElement, clientY: number): number => {
    const rect = element.getBoundingClientRect();
    const y = clientY - rect.top;
    const percentY = y / rect.height;

    // Calculate raw minutes
    const rawMinutes = percentY * 60;

    // Use a percentage-based approach for better cross-browser compatibility
    // If we're in the top or bottom 10% of an hour cell, snap to the hour boundary
    if (percentY > 0.9) {
      return 0; // Next hour (0 minutes)
    } else if (percentY < 0.1 && rawMinutes > 0) {
      return 0; // Current hour (0 minutes)
    }

    // Otherwise, snap to the nearest minStep interval
    const steppedMinutes = Math.round(rawMinutes / minStep) * minStep;

    // Make sure minutes stay within 0-59 range
    return Math.min(59, Math.max(0, steppedMinutes));
  };

  const handleDragStart = (event: CalendarEvent) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedEvent(event.id);

    // Initialize drop preview with the original event's position
    const minutes = event.start.getMinutes();
    const duration = differenceInMinutes(event.end, event.start);

    setDropPreview({
      hour: setHours(date, event.start.getHours()),
      minutes: minutes,
      duration: duration
    });
  };

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
    <div className="flex relative pt-2">
      <TimeTable />
      <div className="flex-1 py-2">
        {hours.map((hour, index) => (
          <div
            key={hour.toString()}
            className={cn(
              "relative border-t",
              index === hours.length - 1 && "border-b"
            )}
            onDragOver={(e) => handleDragOver(e, hour)}
            onDrop={(e) => handleDrop(e, hour)}
          >
            <EventGroup hour={hour} events={events} />
            <DropPreviewIndicator hour={hour} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDayView;
