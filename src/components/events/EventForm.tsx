import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecurrenceOptions } from './RecurrenceOptions';
import type { Event } from '@/types/event';

{/* This is the form for adding or editing an event. I used zod for validation because it was in the starter code I copied. I just followed the docs for most of it. */}
const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  date: z.date().refine(date => date !== null, { message: 'Date is required' }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  recurrence: z.object({
    type: z.enum(['none', 'daily', 'weekly', 'monthly', 'custom']),
    interval: z.number().min(1),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    endDate: z.string().optional(),
    count: z.number().optional(),
  }).optional(),
}).refine((data) => {
  // Validate that end time is after start time
  if (data.startTime && data.endTime) {
    const start = new Date(`2000-01-01T${data.startTime}:00`);
    const end = new Date(`2000-01-01T${data.endTime}:00`);
    return end > start;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

type FormData = z.infer<typeof formSchema>;
type SubmitData = Omit<FormData, 'date'> & { date: string };

interface EventFormProps {
  event?: Event;
  selectedDate?: Date | null;
  onSubmit: (data: SubmitData) => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  selectedDate,
  onSubmit,
  onDelete,
  isSubmitting,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event ? new Date(event.date) : selectedDate || new Date(),
      startTime: event?.startTime || '',
      endTime: event?.endTime || '',
      category: event?.category || '',
      color: event?.color || '',
      recurrence: event?.recurrence || { type: 'none', interval: 1 },
    },
  });

  const handleSubmit = (values: FormData) => {
    const submitData: SubmitData = {
      ...values,
      date: format(values.date, 'yyyy-MM-dd'),
    };
    onSubmit(submitData);
  };

  const categories = ['Work', 'Personal', 'Health', 'Social', 'Other'];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Event details (optional)"
                  className="h-24 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
            name="category"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Start Time</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="Start time"
                      {...field}
                    />
                  </FormControl>
                  <Clock className="ml-2 h-4 w-4 opacity-50 self-center" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>End Time</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="End time"
                      {...field}
                    />
                  </FormControl>
                  <Clock className="ml-2 h-4 w-4 opacity-50 self-center" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <RecurrenceOptions
          form={form}
        />

        <div className="flex justify-between pt-4">
          {event && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
            >
              Delete Event
            </Button>
          )}

          <div className="flex gap-2 ml-auto">
            <Button type="submit" disabled={isSubmitting}>
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </div>
      </form>
  );
};