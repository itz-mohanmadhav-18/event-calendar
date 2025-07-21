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
    console.log('CalendarCell handleEventClick called with:', event.title);
    if (onEventClick) {
      console.log('CalendarCell calling onEventClick');
      onEventClick(event);
    } else {
      console.log('CalendarCell: no onEventClick handler provided');
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-16 sm:min-h-20 md:min-h-24 border border-border p-1 sm:p-2 transition-colors cursor-pointer',
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
            'text-xs sm:text-sm font-medium',
            isToday && 'text-primary font-bold'
          )}
        >
          {date.getDate()}
        </span>
      </div>
      
         <div className="space-y-1">
        {/* This part is for showing up to 3 events in a calendar cell. If there are more, it doesn't show them all. I just used a slice here because I saw it in a tutorial and it worked for me. */}
           {events.slice(0, 3).map((event, index) => (
             <div
               key={event.id}
               onClick={e => {
                 e.stopPropagation();
                 handleEventClick(event);
               }}
               className="cursor-pointer rounded px-1 py-0.5 text-xs bg-accent hover:bg-primary/20 transition-colors truncate"
               title={event.title}
             >
               {event.title}
             </div>
           ))}
         </div>
    </div>
  );
};
