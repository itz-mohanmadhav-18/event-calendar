import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { EventCard } from '../events/EventCard';
import type { Event } from '@/types/event';
import { formatDate } from '@/utils/dateUtils';

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  isCurrentMonth,
  isToday,
  events,
  onDateClick,
  onEventClick,
}) => {
  const dateString = formatDate(date);
  const { isOver, setNodeRef } = useDroppable({
    id: `calendar-cell-${dateString}`,
    data: { date, dateString },
  });

  const handleClick = () => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-24 border border-border p-2 transition-colors cursor-pointer',
        {
          'bg-muted/50 text-muted-foreground': !isCurrentMonth,
          'bg-primary/10 border-primary': isToday,
          'bg-accent/50': isOver,
          'hover:bg-muted/30': isCurrentMonth && !isToday,
        }
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'text-sm font-medium',
            isToday && 'text-primary font-bold'
          )}
        >
          {date.getDate()}
        </span>
      </div>
      
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <EventCard
            key={event.id}
            event={event}
            variant="compact"
            onClick={() => handleEventClick(event)}
          />
        ))}
        
        {events.length > 3 && (
          <div className="text-xs text-muted-foreground">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};
