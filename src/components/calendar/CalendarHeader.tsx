import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDisplayDate } from '@/utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousMonth}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <h2 className="text-2xl font-semibold">
        {formatDisplayDate(currentDate)}
      </h2>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onNextMonth}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};