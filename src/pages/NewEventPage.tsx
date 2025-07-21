import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventForm } from '@/components/events/EventForm';
import { useEvents } from '@/hooks/useEvents';
import { useNavigate } from 'react-router-dom';
import type { CreateEventData } from '@/types/event';

export const NewEventPage: React.FC = () => {
  const { createEvent } = useEvents();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (eventData: CreateEventData) => {
    try {
      setIsSubmitting(true);
      await createEvent(eventData);
      navigate('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};
