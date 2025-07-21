import React from 'react';
import { CalendarGrid } from './CalendarGrid';
import { useCalendar } from '@/hooks/useCalendar';
import { useEvents } from '@/hooks/useEvents';
import type { Event } from '@/types/event';

interface MonthViewProps {
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  onDateClick,
  onEventClick,
}) => {
  const { events } = useEvents();
  const { calendarDays } = useCalendar(events);

  return (
    <div className="w-full">
      <CalendarGrid
        calendarDays={calendarDays}
        onDateClick={onDateClick}
        onEventClick={onEventClick}
      />
    </div>
  );
};
