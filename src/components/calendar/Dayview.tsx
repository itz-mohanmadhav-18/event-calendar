{/* This is the day view. It shows all the events for a single day. I split all-day and timed events because that's what Google Calendar does. I thought it would be easier to see them this way. I just filter the events and then sort them if they have a time. */}
import React from 'react';
import { useCalendarContext } from '@/hooks/useCalendarContext';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '../events/EventCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarActionContext } from '@/components/layout/RootLayout';
import { format } from 'date-fns';
import type { Event } from '@/types/event';

interface DayViewProps {
  onEventClick?: (event: Event) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  onEventClick,
}) => {
  const { events } = useEvents();
  const { currentDate } = useCalendarContext();
  const contextHandlers = React.useContext(CalendarActionContext);

  // Use context handlers if provided, otherwise use props
  const finalOnEventClick = contextHandlers.onEventClick || onEventClick;

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
    if (finalOnEventClick) {
      finalOnEventClick(event);
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
