import React from 'react';
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

export const EventList: React.FC = () => {
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

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
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
          <Card key={date}>
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
                {groupedEvents[date].length} event{groupedEvents[date].length !== 1 && 's'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupedEvents[date].map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    variant="detailed"
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};