import { useState, useCallback } from 'react';
import type  { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type  { Event } from '@/types/index';
import { formatDate } from '@/utils/dateUtils';

interface UseDragDropReturn {
  activeEvent: Event | null;
  isDragging: boolean;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent, onEventMove: (eventId: string, newDate: Date) => void) => void;
  handleDragCancel: () => void;
}

export const useDragDrop = (): UseDragDropReturn => {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setIsDragging(true);
   
    const eventData = event.active.data.current as Event;
    setActiveEvent(eventData);
  }, []);

  const handleDragEnd = useCallback((
    event: DragEndEvent, 
    onEventMove: (eventId: string, newDate: Date) => void
  ) => {
    setIsDragging(false);
    
    if (!activeEvent || !event.over) {
      setActiveEvent(null);
      return;
    }


    const dropTargetId = event.over.id as string;
    const dateMatch = dropTargetId.match(/calendar-cell-(.+)/);
    
    if (dateMatch && dateMatch[1]) {
      const newDateString = dateMatch[1];
      const newDate = new Date(newDateString);
      
      
      if (formatDate(newDate) !== activeEvent.date) {
        onEventMove(activeEvent.id, newDate);
      }
    }
    
    setActiveEvent(null);
  }, [activeEvent]);

  const handleDragCancel = useCallback(() => {
    setIsDragging(false);
    setActiveEvent(null);
  }, []);

  return {
    activeEvent,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};