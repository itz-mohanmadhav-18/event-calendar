import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import type { Event, CreateEventData } from '@/types/event';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  selectedDate?: Date | null;
  title?: string;
  onSubmit: (data: CreateEventData) => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  selectedDate,
  title,
  onSubmit,
  onDelete,
  isSubmitting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || (event ? 'Edit Event' : 'New Event')}</DialogTitle>
          <DialogDescription>
            {event 
              ? 'Update the details of your event.' 
              : 'Add a new event to your calendar.'}
          </DialogDescription>
        </DialogHeader>
        <EventForm
          event={event}
          selectedDate={selectedDate}
          onSubmit={onSubmit}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};