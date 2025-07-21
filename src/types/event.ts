export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  color?: string;
  recurrence?: RecurrencePattern;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrencePattern {
  type: "none" | "daily" | "weekly" | "monthly" | "custom";
  interval: number;
  daysOfWeek?: number[];
  endDate?: string;
  count?: number;
}

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  color?: string;
  recurrence?: RecurrencePattern;
}

export interface UpdateEventData extends Partial<CreateEventData> {};
