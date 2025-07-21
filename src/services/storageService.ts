import type  { Event } from '../types/event';

const EVENTS_STORAGE_KEY = 'event-calendar-events';

export class StorageService {
  async getEvents(): Promise<Event[]> {
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      return storedEvents ? JSON.parse(storedEvents) : [];
    } catch (error) {
      // Silently return empty array if storage is corrupted
      return [];
    }
  }

  async saveEvents(events: Event[]): Promise<void> {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      throw new Error('Failed to save events to storage');
    }
  }

  async saveEvent(event: Event): Promise<void> {
    const events = await this.getEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    
    if (existingIndex >= 0) {
      events[existingIndex] = event;
    } else {
      events.push(event);
    }
    
    await this.saveEvents(events);
  }

  async updateEvent(event: Event): Promise<void> {
    const events = await this.getEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    
    if (existingIndex >= 0) {
      events[existingIndex] = event;
      await this.saveEvents(events);
    } else {
      throw new Error(`Event with id ${event.id} not found`);
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    const events = await this.getEvents();
    const filteredEvents = events.filter(e => e.id !== eventId);
    
    if (filteredEvents.length === events.length) {
      return false; // Event not found
    }
    
    await this.saveEvents(filteredEvents);
    return true;
  }

  async getEventsByDate(date: string): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(event => event.date === date);
  }

  async clearAllEvents(): Promise<void> {
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  }
}

export const storageService = new StorageService();