import type { Event } from './event';

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: 'month' | 'week' | 'day';
  events: Event[];
  loading: boolean;
  error: string | null;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}