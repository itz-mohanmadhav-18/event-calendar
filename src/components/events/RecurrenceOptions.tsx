import React, { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecurrenceOptionsProps {
  form: UseFormReturn<{
    title: string;
    description?: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    category?: string;
    color?: string;
    recurrence?: {
      type: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
      interval: number;
      daysOfWeek?: number[];
      endDate?: string;
      count?: number;
    };
  }>;
}

// This is for setting up recurring events. I don't fully understand all the options but it works for daily/weekly/monthly. I just followed what I found online.
export const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({
  form,
}) => {
  const recurrenceType = form.watch('recurrence.type') || 'none';

  // Set default values based on recurrence type
  useEffect(() => {
    if (!form.getValues('recurrence')) {
      form.setValue('recurrence', { type: 'none', interval: 1 });
    }
  }, [form]);

  // Reset recurrence fields when type changes
  useEffect(() => {
    if (recurrenceType === 'none') {
      form.setValue('recurrence', { type: 'none', interval: 1 });
    } else if (recurrenceType !== form.getValues('recurrence.type')) {
      form.setValue('recurrence.interval', 1);
      form.setValue('recurrence.daysOfWeek', undefined);
      form.setValue('recurrence.endDate', undefined);
      form.setValue('recurrence.count', undefined);
    }
  }, [recurrenceType, form]);

  const weekdays = [
    { value: '0', label: 'Sun' },
    { value: '1', label: 'Mon' },
    { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' },
    { value: '4', label: 'Thu' },
    { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' },
  ];

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="recurrence.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recurrence</FormLabel>
            <Select
              value={field.value || 'none'}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="No recurrence" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">No recurrence</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {recurrenceType !== 'none' && (
        <>
          <FormField
            control={form.control}
            name="recurrence.interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {recurrenceType === 'daily' && 'Repeat every X days'}
                  {recurrenceType === 'weekly' && 'Repeat every X weeks'}
                  {recurrenceType === 'monthly' && 'Repeat every X months'}
                  {recurrenceType === 'custom' && 'Interval'}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(recurrenceType === 'weekly' || recurrenceType === 'custom') && (
            <div>
              <FormLabel>Repeat on</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {weekdays.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={
                        form.getValues('recurrence.daysOfWeek')?.includes(parseInt(day.value))
                      }
                      onCheckedChange={(checked) => {
                        const current = form.getValues('recurrence.daysOfWeek') || [];
                        const dayVal = parseInt(day.value);
                        
                        if (checked) {
                          form.setValue('recurrence.daysOfWeek', [...current, dayVal].sort());
                        } else {
                          form.setValue(
                            'recurrence.daysOfWeek',
                            current.filter((d: number) => d !== dayVal)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="recurrence.endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>No end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurrence.count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Occurrences (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};