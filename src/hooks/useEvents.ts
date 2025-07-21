import { useState, useEffect, useCallback } from 'react';
import type { Event, CreateEventData, UpdateEventData } from '@/types/event';
import { storageService } from '@/services/storageService';
import { recurrenceService } from '@/services/recurrenceService';

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  createEvent: (eventData: CreateEventData) => Promise<Event>;
  updateEvent: (id: string, updates: UpdateEventData) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  getEventById: (id: string) => Event | undefined;
  refreshEvents: () => Promise<void>;
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let storedEvents = await storageService.getEvents();
      
      // Initialize with sample events for first-time users
      if (storedEvents.length === 0 || storedEvents.length > 50) {
        const sampleEvents = [
          {
            id: 'sample-1',
            title: 'Sample Meeting',
            description: 'Click me to edit!',
            date: '2025-07-21',
            startTime: '10:00',
            endTime: '11:00',
            category: 'work',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'sample-2',
            title: 'Test Event', 
            description: 'This is clickable',
            date: '2025-07-22',
            startTime: '14:00',
            endTime: '15:30',
            category: 'personal',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
        await storageService.saveEvents(sampleEvents);
        storedEvents = sampleEvents;
      }
      
      setEvents(storedEvents);
    } catch (err) {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: CreateEventData): Promise<Event> => {
    try {
      setError(null);
      // Don't allow creating events in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(eventData.date);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        setError('Cannot create events in the past.');
        throw new Error('Cannot create events in the past.');
      }
      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Handle recurring events differently
      if (newEvent.recurrence && newEvent.recurrence.type !== 'none') {
        const recurringEvents = await recurrenceService.generateEvents(newEvent);
        await storageService.saveEvents(recurringEvents);
        setEvents(prev => [...prev, ...recurringEvents]);
        return newEvent;
      }

      await storageService.saveEvent(newEvent);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError('Failed to create event. Please try again.');
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (id: string, updates: UpdateEventData): Promise<Event | null> => {
    try {
      setError(null);
      const existingEvent = events.find(e => e.id === id);
      if (!existingEvent) return null;

      const updatedEvent: Event = {
        ...existingEvent,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await storageService.updateEvent(updatedEvent);
      
      // Reload events if recurrence pattern changed
      if (
        updatedEvent.recurrence?.type !== existingEvent.recurrence?.type ||
        updatedEvent.recurrence?.interval !== existingEvent.recurrence?.interval
      ) {
        await loadEvents();
      } else {
        setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
      }
      
      return updatedEvent;
    } catch (err) {
      setError('Failed to update event. Please try again.');
      throw err;
    }
  }, [events, loadEvents]);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const existingEvent = events.find(e => e.id === id);
      if (!existingEvent) return false;

      await storageService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete event. Please try again.');
      throw err;
    }
  }, [events]);

  const getEventById = useCallback((id: string): Event | undefined => {
    return events.find(e => e.id === id);
  }, [events]);

  const refreshEvents = useCallback(async (): Promise<void> => {
    await loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    refreshEvents,
  };
};