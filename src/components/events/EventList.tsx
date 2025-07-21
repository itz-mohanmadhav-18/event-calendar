{/* This is the event list. It groups events by date and shows them in cards. I used a reduce to group them because I saw it on Stack Overflow and it seemed to work. */}
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventCard } from './EventCard';
import { useEvents } from '@/hooks/useEvents';
import { useEventFilters } from '@/hooks/useEventFilters';
import { Plus } from 'lucide-react';


interface EventListProps {
  onEventClick?: (event: import('@/types/event').Event) => void;
}


const EventDateGroup: React.FC<{
  date: string;
  events: import('@/types/event').Event[];
  onEventClick: (event: import('@/types/event').Event) => void;
}> = ({ date, events, onEventClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `calendar-cell-${date}`,
    data: { date },
  });
  return (
    <Card key={date} ref={setNodeRef} className={isOver ? 'ring-2 ring-primary' : ''}>
      <CardHeader>
        <CardTitle className="text-lg">
          {new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </CardTitle>
        <CardDescription>
          {events.length} event{events.length !== 1 && 's'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              variant="detailed"
              onClick={() => onEventClick(event)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const EventList: React.FC<EventListProps> = ({ onEventClick }) => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const { filteredEvents, searchQuery } = useEventFilters(events);

  // Group events by date
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const handleEventClick = (event: import('@/types/event').Event) => {
    if (onEventClick) {
      onEventClick(event);
    } else {
      navigate(`/events/${event.id}/edit`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filteredEvents.length === 0 ? (
        <Card className="text-center p-12">
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'No events match your search criteria.' 
                : 'You have no events. Create your first event to get started.'}
            </p>
            <Button onClick={() => navigate('/events/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((date) => (
          <EventDateGroup
            key={date}
            date={date}
            events={groupedEvents[date]}
            onEventClick={handleEventClick}
          />
        ))
      )}
    </div>
  );
};