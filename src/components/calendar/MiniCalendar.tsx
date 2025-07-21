import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useCalendarContext } from '@/hooks/useCalendarContext';

interface MiniCalendarProps {
  onDateSelect?: (date: Date) => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  onDateSelect,
}) => {
  const { selectedDate, setSelectedDate } = useCalendarContext();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      if (onDateSelect) {
        onDateSelect(date);
      }
    }
  };

  return (
    <div className="p-2">
      <Calendar
        mode="single"
        selected={selectedDate || undefined}
        onSelect={handleDateSelect}
        className="rounded-md border-0"
      />
    </div>
  );
};
