import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';
import { EventModal } from '../events/EventModal';
import { EventFilters } from '../events/EventFilters';
import { UpcomingEvents } from '../events/UpcomingEvents';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';
import { MiniCalendar } from '../calendar/MiniCalendar';
import { Plus } from 'lucide-react';
import type { Event, CreateEventData, UpdateEventData } from '@/types/event';

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createEvent, updateEvent, deleteEvent } = useEvents();
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
    <>
      <TopNavbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Sidebar />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quick Add</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(null);
                        setIsModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MiniCalendar />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <EventFilters />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <UpcomingEvents />
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
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
    </>
  );
};
