import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EventList } from '@/components/events/EventList';
import { EventFilters } from '@/components/events/EventFilters';
import { EventModal } from '@/components/events/EventModal';
import { useEvents } from '@/hooks/useEvents';
import { useEventFilters } from '@/hooks/useEventFilters';
import { Plus, Search } from 'lucide-react';
import type { Event, CreateEventData, UpdateEventData } from '@/types/event';

export const EventsPage: React.FC = () => {
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();
  const { searchQuery, setSearchQuery } = useEventFilters(events);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const handleCreateEvent = async (eventData: CreateEventData) => {
    try {
      await createEvent(eventData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleUpdateEvent = async (eventData: UpdateEventData) => {
    if (selectedEvent) {
      try {
        await updateEvent(selectedEvent.id, eventData);
        setIsModalOpen(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Failed to update event:', error);
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await deleteEvent(selectedEvent.id);
        setIsModalOpen(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <EventFilters />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Events</CardTitle>
                <Button onClick={() => {
                  setSelectedEvent(null);
                  setIsModalOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <EventList />
            </CardContent>
          </Card>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent || undefined}
        onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        isSubmitting={false}
      />
    </div>
  );
};
