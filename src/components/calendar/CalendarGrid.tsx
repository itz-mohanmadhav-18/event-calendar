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
  const weekdaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* This is the header row that shows the days of the week. I put it here so it's always at the top of the calendar. */}
      <div className="grid grid-cols-7 bg-muted">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className="p-2 md:p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
          >
            {/* Show full day names on larger screens, abbreviated on mobile */}
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{weekdaysShort[index]}</span>
          </div>
        ))}
      </div>

      {/* This is the main grid for the days in the calendar. Each cell is a day and can have events in it. */}
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
