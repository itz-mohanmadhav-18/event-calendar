import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';
import { formatTime } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';

export const UpcomingEvents: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return events
      .filter(event => {
        // Include today's events if they're in the future
        if (event.date === today) {
          if (!event.startTime) return true; // All-day events for today are included
          
          const eventTime = new Date(`${event.date}T${event.startTime}`);
          return eventTime > now;
        }
        
        // Include all future events
        return event.date > today;
      })
      .sort((a, b) => {
        // Sort by date first
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        
        // Then by time if available
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        
        // All-day events come first
        if (!a.startTime) return -1;
        if (!b.startTime) return 1;
        
        return 0;
      })
      .slice(0, 5); // Get the next 5 upcoming events
  }, [events]);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Loading...</div>;
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p className="mb-2">No upcoming events</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/events/new')}
        >
          Add Event
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {upcomingEvents.map(event => (
        <div
          key={event.id}
          className="p-2 text-sm border-l-2 border-primary/20 hover:bg-accent/50 rounded-sm cursor-pointer"
          onClick={() => handleEventClick(event.id)}
        >
          <p className="font-medium truncate">{event.title}</p>
          <div className="text-xs text-muted-foreground">
            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {event.startTime && ` • ${formatTime(event.startTime)}`}
          </div>
        </div>
      ))}
      
      {events.length > upcomingEvents.length && (
        <Button
          variant="ghost" 
          size="sm"
          className="w-full text-xs text-muted-foreground mt-2"
          onClick={() => navigate('/events')}
        >
          View All Events
        </Button>
      )}
    </div>
  );
};