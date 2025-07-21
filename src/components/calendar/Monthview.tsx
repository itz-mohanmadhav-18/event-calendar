{/* Month view component that displays the calendar grid for the current month */}
import React from 'react';
import { CalendarGrid } from './CalendarGrid';
import { useCalendarContext } from '@/hooks/useCalendarContext';
import { CalendarActionContext } from '@/components/layout/RootLayout';
import type { Event } from '@/types/event';

interface MonthViewProps {
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  onDateClick,
  onEventClick,
}) => {
  const { calendarDays } = useCalendarContext();
  const contextHandlers = React.useContext(CalendarActionContext);

  // Prefer context handlers over props for better component integration
  const finalOnDateClick = contextHandlers.onDateClick || onDateClick;
  const finalOnEventClick = contextHandlers.onEventClick || onEventClick;

  return (
    <div className="w-full">
      <CalendarGrid
        calendarDays={calendarDays}
        onDateClick={finalOnDateClick}
        onEventClick={finalOnEventClick}
      />
    </div>
  );
};
