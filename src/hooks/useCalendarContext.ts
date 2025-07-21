import { useContext } from 'react';
import { CalendarContext } from '@/contexts/CalendarContext';
import type { CalendarContextType } from '@/contexts/CalendarContext';

export const useCalendarContext = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
};
