import type { Event } from '@/types/event';

export interface EventConflict {
  conflictingEvent: Event;
  type: 'overlap' | 'same-time';
}

export const detectEventConflicts = (
  newEvent: Pick<Event, 'date' | 'startTime' | 'endTime'>,
  existingEvents: Event[],
  excludeEventId?: string
): EventConflict[] => {
  const conflicts: EventConflict[] = [];
  
  // Filter events for the same date
  const sameDateEvents = existingEvents.filter(event => {
    if (excludeEventId && event.id === excludeEventId) return false;
    return event.date === newEvent.date;
  });

  // If no time specified, no time-based conflicts possible
  if (!newEvent.startTime || !newEvent.endTime) {
    return conflicts;
  }

  const newStart = timeStringToMinutes(newEvent.startTime);
  const newEnd = timeStringToMinutes(newEvent.endTime);

  for (const event of sameDateEvents) {
    if (!event.startTime || !event.endTime) continue;

    const eventStart = timeStringToMinutes(event.startTime);
    const eventEnd = timeStringToMinutes(event.endTime);

    // Check for time overlap
    const hasOverlap = (newStart < eventEnd && newEnd > eventStart);
    
    if (hasOverlap) {
      const conflictType = 
        (newStart === eventStart && newEnd === eventEnd) ? 'same-time' : 'overlap';
      
      conflicts.push({
        conflictingEvent: event,
        type: conflictType,
      });
    }
  }

  return conflicts;
};

export const hasEventConflicts = (
  newEvent: Pick<Event, 'date' | 'startTime' | 'endTime'>,
  existingEvents: Event[],
  excludeEventId?: string
): boolean => {
  return detectEventConflicts(newEvent, existingEvents, excludeEventId).length > 0;
};

export const getConflictMessage = (conflicts: EventConflict[]): string => {
  if (conflicts.length === 0) return '';
  
  if (conflicts.length === 1) {
    const conflict = conflicts[0];
    const timeStr = conflict.conflictingEvent.startTime 
      ? `at ${conflict.conflictingEvent.startTime}`
      : '';
    
    return `This event ${conflict.type === 'same-time' ? 'has the exact same time as' : 'overlaps with'} "${conflict.conflictingEvent.title}" ${timeStr}.`;
  }
  
  return `This event conflicts with ${conflicts.length} other events on the same day.`;
};

// Helper function to convert time string (HH:MM) to minutes since midnight
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
