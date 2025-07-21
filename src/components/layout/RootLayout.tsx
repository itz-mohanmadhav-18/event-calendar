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
import { formatDate } from '@/utils/dateUtils';
import type { Event, CreateEventData, UpdateEventData } from '@/types/event';

{/* Create a context to pass down the calendar event handlers */}
export const CalendarActionContext = React.createContext<{
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}>({});

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createEvent, updateEvent, deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const handleDateClick = React.useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);

  const handleEventClick = React.useCallback((event: Event) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  }, []);

  {/* Memoize the context value to prevent unnecessary re-renders */}
  const contextValue = React.useMemo(() => ({
    onDateClick: handleDateClick,
    onEventClick: handleEventClick
  }), [handleDateClick, handleEventClick]);

  const handleCreateEvent = async (eventData: CreateEventData) => {
    try {
      // If a date was clicked, use that date
      const finalEventData = selectedDate 
        ? { ...eventData, date: formatDate(selectedDate) }
        : eventData;
      
      await createEvent(finalEventData);
      setIsModalOpen(false);
      setSelectedDate(null);
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
        <div className="container mx-auto px-4 py-2 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Sidebar - Hidden on mobile, shown in collapsed view */}
            <div className="hidden lg:block lg:col-span-1 space-y-4">
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

            {/* Mobile Menu Button - Show on small screens */}
            <div className="lg:hidden mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedEvent(null);
                        setIsModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <CalendarActionContext.Provider value={contextValue}>
                {children}
              </CalendarActionContext.Provider>
            </div>
          </div>
        </div>

        <EventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            setSelectedDate(null);
          }}
          event={selectedEvent || undefined}
          selectedDate={selectedDate}
          onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
          isSubmitting={false}
        />
      </div>
    </>
  );
};
