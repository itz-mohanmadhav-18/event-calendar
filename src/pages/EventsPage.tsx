
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EventList } from '@/components/events/EventList';
import { EventFilters } from '@/components/events/EventFilters';
import { useContext } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useEventFilters } from '@/hooks/useEventFilters';
import { Plus, Search } from 'lucide-react';
import { CalendarActionContext } from '@/components/layout/RootLayout';

{/* This is the page where you can see all the events in a list, not the calendar. I used hooks here to get the events and also to filter them if you search. The context is for opening the modal when you want to add or edit an event. I hope this is the right way to do it. */}
export const EventsPage: React.FC = () => {
  const { events } = useEvents(); {/* this gets all the events from the custom hook, I think it updates when you add or delete */}
  const { searchQuery, setSearchQuery } = useEventFilters(events); {/* this is for searching events, it uses another hook */}
  const { onEventClick, onDateClick } = useContext(CalendarActionContext); {/* this is from the layout, it helps with opening the modal */}

  {/* The layout below is using some grid stuff, the left side is for filters and the right side is for the main event list. The button lets you add a new event (it opens the modal). The search bar lets you type and it will filter the events. I put the EventList at the bottom so it shows all the events, and clicking one should open the modal to edit it. I hope this is clear. */}
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Events</CardTitle>
                <Button onClick={() => {
                  if (onDateClick) onDateClick(new Date());
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <EventList onEventClick={onEventClick} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
