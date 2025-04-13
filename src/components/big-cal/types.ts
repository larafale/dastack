

export interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: string
}

export type View = 'day' | 'week' | 'month' | 'year';
