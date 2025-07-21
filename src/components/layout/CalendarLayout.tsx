import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalendarHeader } from '../calendar/CalendarHeader';
import { CalendarViewSwitcher } from '../calendar/CalendarViewSwitcher';
import { useCalendar } from '@/hooks/useCalendar';
import { useEvents } from '@/hooks/useEvents';

interface CalendarLayoutProps {
  children: React.ReactNode;
}

export const CalendarLayout: React.FC<CalendarLayoutProps> = ({ children }) => {
  const { events } = useEvents();
  const {
    currentDate,
    viewMode,
    setViewMode,
    goToNextMonth,
    goToPreviousMonth,
    goToToday
  } = useCalendar(events);

  const handleNavigation = (direction: 'next' | 'previous' | 'today') => {
    switch (direction) {
      case 'next':
        goToNextMonth();
        break;
      case 'previous':
        goToPreviousMonth();
        break;
      case 'today':
        goToToday();
        break;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CalendarHeader
            currentDate={currentDate}
            onPreviousMonth={() => handleNavigation('previous')}
            onNextMonth={() => handleNavigation('next')}
          />
          <div className="flex items-center gap-2">
            <CalendarViewSwitcher
              currentView={viewMode}
              onViewChange={setViewMode}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
