import { useState, useCallback, useMemo } from 'react';
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, 
  startOfWeek, endOfWeek, addMonths, subMonths, 
  isSameDay, format
} from 'date-fns';
import type { Event } from '@/types/event';
import type { CalendarDay } from '@/types/calendar';

type ViewMode = 'month' | 'week' | 'day';

interface UseCalendarReturn {
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

export const useCalendar = (events: Event[] = []): UseCalendarReturn => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Navigate to next month
  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1));
  }, []);

  // Navigate to previous month
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => subMonths(prev, 1));
  }, []);

  // Go to today
  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  // Check if date is selected
  const isDateSelected = useCallback((date: Date): boolean => {
    return selectedDate ? isSameDay(date, selectedDate) : false;
  }, [selectedDate]);

  // Check if date is today
  const isDateToday = useCallback((date: Date): boolean => {
    return isSameDay(date, new Date());
  }, []);

  // Generate calendar days for month view with events
  const calendarDays = useMemo((): CalendarDay[] => {
    // Get first and last day of month
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Get first and last day of calendar grid (to include days from prev/next month)
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    // Get all days in the calendar grid
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    // Map days to CalendarDay objects with events
    return days.map(date => {
      const dateString = format(date, 'yyyy-MM-dd');
      const dayEvents = events.filter(event => event.date === dateString);
      
      return {
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday: isDateToday(date),
        events: dayEvents,
      };
    });
  }, [currentDate, events, isDateToday]);

  return {
    currentDate,
    selectedDate,
    viewMode,
    calendarDays,
    setCurrentDate,
    setSelectedDate,
    setViewMode,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    isDateSelected,
    isDateToday,
  };
};