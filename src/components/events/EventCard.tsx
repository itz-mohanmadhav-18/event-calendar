import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/dateUtils';
import { Clock, Calendar, GripVertical } from 'lucide-react';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  variant?: 'compact' | 'default' | 'detailed';
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = 'default',
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: event,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      work: 'bg-blue-500',
      personal: 'bg-green-500',
      health: 'bg-red-500',
      social: 'bg-purple-500',
    };
    return colors[category?.toLowerCase() || ''] || 'bg-gray-500';
  };

  if (variant === 'compact') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          "group relative px-2 py-1 rounded text-xs border-l-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer",
          {
            'opacity-50 shadow-sm': isDragging,
          },
          event.color ? `border-l-[${event.color}]` : `border-l-[${getCategoryColor(event.category)}]`
        )}
        {...attributes}
        {...listeners}
      >
        <div className="truncate font-medium">{event.title}</div>
        {event.startTime && (
          <div className="text-[10px] text-muted-foreground">{formatTime(event.startTime)}</div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        onClick={onClick}
        className={cn(
          "group p-4 cursor-pointer hover:shadow-md transition-all border-l-4",
          {
            'opacity-50 shadow-lg': isDragging,
          },
          event.color ? `border-l-[${event.color}]` : `border-l-[${getCategoryColor(event.category)}]`
        )}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <GripVertical className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
              <h3 className="font-medium truncate">{event.title}</h3>
            </div>
            
            {event.description && (
              <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
            )}
            
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              
              {event.startTime && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </div>
              )}
              
              {event.category && (
                <Badge variant="outline" className="text-xs">
                  {event.category}
                </Badge>
              )}
              
              {event.recurrence && (
                <Badge variant="secondary" className="text-xs">
                  {event.recurrence.type === 'daily' && 'Daily'}
                  {event.recurrence.type === 'weekly' && 'Weekly'}
                  {event.recurrence.type === 'monthly' && 'Monthly'}
                  {event.recurrence.type === 'custom' && 'Custom'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={cn(
        "group p-3 cursor-pointer hover:shadow-md transition-all",
        {
          'opacity-50 shadow-lg': isDragging,
        }
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", 
          event.color || getCategoryColor(event.category)
        )} />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{event.title}</h3>
          
          {event.startTime && (
            <div className="text-xs text-muted-foreground">
              {formatTime(event.startTime)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};