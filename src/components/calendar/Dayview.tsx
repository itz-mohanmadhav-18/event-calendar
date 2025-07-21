import React from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '../events/EventCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import type { Event } from '@/types/event';

interface DayViewProps {
  onEventClick?: (event: Event) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  onEventClick,
}) => {
  const { events } = useEvents();
  const { currentDate } = useCalendar(events);

  const currentDateString = format(currentDate, 'yyyy-MM-dd');
  const dayEvents = events.filter(event => event.date === currentDateString);

  // Separate timed and all-day events
  const timedEvents = dayEvents.filter(event => event.startTime);
  const allDayEvents = dayEvents.filter(event => !event.startTime);

  // Sort timed events by start time
  const sortedTimedEvents = timedEvents.sort((a, b) => {
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    return 0;
  });

  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* All-day events */}
          {allDayEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                All Day
              </h3>
              <div className="space-y-2">
                {allDayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    variant="default"
                    onClick={() => handleEventClick(event)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Timed events */}
          {sortedTimedEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Scheduled
              </h3>
              <div className="space-y-3">
                {sortedTimedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-3 border border-border rounded-lg"
                  >
                    <div className="text-sm font-medium text-muted-foreground min-w-16">
                      {event.startTime && format(new Date(`2000-01-01T${event.startTime}`), 'h:mm a')}
                    </div>
                    <div className="flex-1">
                      <EventCard
                        event={event}
                        variant="detailed"
                        onClick={() => handleEventClick(event)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {dayEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No events scheduled for this day
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
