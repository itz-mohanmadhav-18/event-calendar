import React from 'react';
import { CalendarCell } from './CalendarCell';
import type { CalendarDay } from '@/types/calendar';
import type { Event } from '@/types/event';

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  onDateClick,
  onEventClick,
}) => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header row with weekday names */}
      <div className="grid grid-cols-7 bg-muted">
        {weekdays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <CalendarCell
            key={`${day.date.toISOString()}-${index}`}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.isToday}
            events={day.events}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};
