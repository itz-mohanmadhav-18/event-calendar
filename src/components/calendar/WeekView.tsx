import React from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useEvents } from '@/hooks/useEvents';
import { CalendarCell } from './CalendarCell';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import type { Event } from '@/types/event';
import type { CalendarDay } from '@/types/calendar';

interface WeekViewProps {
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  onDateClick,
  onEventClick,
}) => {
  const { events } = useEvents();
  const { currentDate, isDateToday } = useCalendar(events);

  // Get the current week's days
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Create CalendarDay objects for the week
  const calendarDays: CalendarDay[] = weekDays.map(date => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dayEvents = events.filter(event => event.date === dateString);
    
    return {
      date,
      isCurrentMonth: date.getMonth() === currentDate.getMonth(),
      isToday: isDateToday(date),
      events: dayEvents,
    };
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header row with weekday names and dates */}
        <div className="grid grid-cols-7 bg-muted">
          {weekDays.map((day, index) => (
            <div
              key={day.toISOString()}
              className="p-3 text-center border-r border-border last:border-r-0"
            >
              <div className="text-sm font-medium text-muted-foreground">
                {weekdays[index]}
              </div>
              <div className="text-lg font-semibold mt-1">
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week days grid */}
        <div className="grid grid-cols-7 min-h-96">
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
    </div>
  );
};
