import type { Event, RecurrencePattern } from '@/types/event';
import { addDays, addWeeks, addMonths, format, parseISO, isAfter } from 'date-fns';

export class RecurrenceService {
  async generateEvents(baseEvent: Event): Promise<Event[]> {
    if (!baseEvent.recurrence || baseEvent.recurrence.type === 'none') {
      return [baseEvent];
    }

    const events: Event[] = [baseEvent];
    const { recurrence } = baseEvent;
    const startDate = parseISO(baseEvent.date);
    
    let currentDate = startDate;
    let count = 0;
    const maxCount = recurrence.count || 100; // Default limit to prevent infinite generation
    const endDate = recurrence.endDate ? parseISO(recurrence.endDate) : null;

    while (count < maxCount) {
      count++;
      
      // Calculate next occurrence based on recurrence type
      switch (recurrence.type) {
        case 'daily':
          currentDate = addDays(currentDate, recurrence.interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, recurrence.interval);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, recurrence.interval);
          break;
        case 'custom':
          if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
            currentDate = this.getNextWeekdayOccurrence(currentDate, recurrence.daysOfWeek);
          } else {
            currentDate = addDays(currentDate, recurrence.interval);
          }
          break;
        default:
          return events;
      }

      // Stop if we've reached the end date
      if (endDate && isAfter(currentDate, endDate)) {
        break;
      }

      // Create the recurring event
      const recurringEvent: Event = {
        ...baseEvent,
        id: crypto.randomUUID(),
        date: format(currentDate, 'yyyy-MM-dd'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      events.push(recurringEvent);
    }

    return events;
  }

  private getNextWeekdayOccurrence(currentDate: Date, daysOfWeek: number[]): Date {
    let nextDate = addDays(currentDate, 1);
    
    while (!daysOfWeek.includes(nextDate.getDay())) {
      nextDate = addDays(nextDate, 1);
    }
    
    return nextDate;
  }

  isRecurringEvent(event: Event): boolean {
    return event.recurrence ? event.recurrence.type !== 'none' : false;
  }

  getRecurrenceDescription(recurrence: RecurrencePattern): string {
    switch (recurrence.type) {
      case 'daily':
        return recurrence.interval === 1 ? 'Daily' : `Every ${recurrence.interval} days`;
      case 'weekly':
        return recurrence.interval === 1 ? 'Weekly' : `Every ${recurrence.interval} weeks`;
      case 'monthly':
        return recurrence.interval === 1 ? 'Monthly' : `Every ${recurrence.interval} months`;
      case 'custom':
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const selectedDays = recurrence.daysOfWeek.map(day => dayNames[day]).join(', ');
          return `Every ${selectedDays}`;
        }
        return 'Custom recurrence';
      default:
        return 'No recurrence';
    }
  }
}

export const recurrenceService = new RecurrenceService();
