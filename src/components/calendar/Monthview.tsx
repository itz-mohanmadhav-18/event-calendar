{/* This is the month view. It uses the CalendarGrid to show all the days for the current month. I used context to get the handlers because it seemed easier than passing them down everywhere. */}
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

  console.log('MonthView - contextHandlers:', contextHandlers);
  console.log('MonthView - contextHandlers.onEventClick exists:', !!contextHandlers.onEventClick);

  // Use context handlers if provided, otherwise use props
  const finalOnDateClick = contextHandlers.onDateClick || onDateClick;
  const finalOnEventClick = contextHandlers.onEventClick || onEventClick;

  console.log('MonthView - finalOnEventClick exists:', !!finalOnEventClick);

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
