import React, { createContext } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useEvents } from '@/hooks/useEvents';
import type { CalendarDay } from '@/types/calendar';

type ViewMode = 'month' | 'week' | 'day';

export interface CalendarContextType {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: ViewMode;
  calendarDays: CalendarDay[];
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  setViewMode: (mode: ViewMode) => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToToday: () => void;
  isDateSelected: (date: Date) => boolean;
  isDateToday: (date: Date) => boolean;
}

export const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { events } = useEvents();
  const calendarState = useCalendar(events);

  return (
    <CalendarContext.Provider value={calendarState}>
      {children}
    </CalendarContext.Provider>
  );
};
