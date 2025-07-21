import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarViewSwitcherProps {
  currentView: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
}

export const CalendarViewSwitcher: React.FC<CalendarViewSwitcherProps> = ({
  currentView,
  onViewChange,
}) => {
  const views = [
    { value: 'month' as const, label: 'Month' },
    { value: 'week' as const, label: 'Week' },
    { value: 'day' as const, label: 'Day' },
  ];

  return (
    <div className="flex rounded-lg border border-border p-1">
      {views.map((view) => (
        <Button
          key={view.value}
          variant={currentView === view.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(view.value)}
          className={cn(
            'h-7 px-3 text-xs',
            currentView === view.value && 'bg-primary text-primary-foreground shadow-sm'
          )}
        >
          {view.label}
        </Button>
      ))}
    </div>
  );
};
