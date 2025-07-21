import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventForm } from '@/components/events/EventForm';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { UpdateEventData } from '@/types/event';

export const EditEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { getEventById, updateEvent, deleteEvent } = useEvents();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const event = eventId ? getEventById(eventId) : undefined;

  React.useEffect(() => {
    if (!event && eventId) {
      navigate('/events');
    }
  }, [event, eventId, navigate]);

  const handleSubmit = async (eventData: UpdateEventData) => {
    if (!eventId) return;
    
    try {
      setIsSubmitting(true);
      await updateEvent(eventId, eventData);
      navigate('/events');
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!eventId) return;
    
    try {
      setIsSubmitting(true);
      await deleteEvent(eventId);
      navigate('/events');
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="text-center p-12">
            <p className="text-muted-foreground">Event not found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            event={event}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};
