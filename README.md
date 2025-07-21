# Event Calendar Application

Hey! This is my event calendar project that I built using React, TypeScript, and Vite. It's basically a calendar app where you can create, edit, and manage events. I tried to make it as feature-rich as possible while keeping the code organized.

## What This App Does

This is a full-featured calendar application where you can:
- View events in month, week, or day view
- Create new events with titles, descriptions, dates, times, and categories
- Edit existing events by clicking on them
- Delete events you don't need anymore
- Drag and drop events to different dates (this was tricky to implement!)
- Search and filter events by category
- Export/import your calendar data as JSON
- Set up recurring events (daily, weekly, monthly)

## Tech Stack

I used these technologies (some were new to me):
- **React 19** - The main framework
- **TypeScript** - For better code quality and catching errors
- **Vite** - Super fast development server
- **React Router** - For navigation between pages
- **Tailwind CSS** - For styling (I love how quick it is!)
- **date-fns** - For date manipulation (way better than vanilla JS dates)
- **@dnd-kit** - For drag and drop functionality
- **Radix UI** - For accessible UI components
- **React Hook Form** - For form handling
- **Zod** - For form validation

## Project Structure

Here's how I organized the code:

```
src/
├── components/           # Reusable UI components
│   ├── calendar/        # Calendar-specific components
│   ├── events/          # Event-related components  
│   ├── layout/          # Layout components
│   └── ui/              # Basic UI components (buttons, cards, etc.)
├── contexts/            # React contexts for state management
├── hooks/               # Custom hooks (this is where the logic lives)
├── pages/               # Main page components
├── services/            # Data services (storage, etc.)
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Custom Hooks (The Heart of the App)

I created several custom hooks to manage different parts of the app. Here's what each one does:

### useEvents Hook
**File:** `src/hooks/useEvents.ts`

This is probably the most important hook. It manages all the event data:
- `events` - Array of all events
- `loading` - Boolean for loading state
- `error` - Error message if something goes wrong
- `createEvent()` - Creates a new event
- `updateEvent()` - Updates an existing event  
- `deleteEvent()` - Deletes an event
- `getEventById()` - Finds a specific event
- `refreshEvents()` - Reloads all events

I use localStorage to persist the data, so your events stick around even after closing the browser.

### useCalendar Hook
**File:** `src/hooks/useCalendar.ts`

This handles the calendar view and navigation:
- `currentDate` - The month/date currently being viewed
- `selectedDate` - The date the user clicked on
- `viewMode` - Whether we're in month, week, or day view
- `calendarDays` - Array of all days to display with their events
- Navigation functions like `goToNextMonth()`, `goToPreviousMonth()`, `goToToday()`
- Helper functions to check if a date is selected or is today

### useEventFilters Hook  
**File:** `src/hooks/useEventFilters.ts`

For searching and filtering events:
- `searchQuery` - What the user is searching for
- `selectedCategory` - Which category is selected  
- `filteredEvents` - Events that match the current filters
- Functions to update the search query and selected category

### useDragDrop Hook
**File:** `src/hooks/useDragDrop.ts`

This was the hardest one to implement! It handles dragging events between dates:
- `activeEvent` - The event currently being dragged
- `isDragging` - Whether a drag operation is in progress
- `handleDragStart()` - When user starts dragging
- `handleDragEnd()` - When user drops the event
- `handleDragCancel()` - If drag is cancelled

## Routes (Navigation)

Here are all the different pages you can navigate to:

### Calendar Views
- `/` - Redirects to `/calendar/month`
- `/calendar/month` - Month view (default)
- `/calendar/week` - Week view (not fully implemented yet)
- `/calendar/day` - Day view (not fully implemented yet)

### Event Management
- `/events` - List view of all events with search/filter
- `/events/new` - Create a new event
- `/events/:eventId/edit` - Edit a specific event

### Settings
- `/settings` - App settings and data management

I used React Router for all the navigation. The routing is set up in `App.tsx`.

## Main Components

### Calendar Components
- **MonthView** - Shows the calendar grid for a month
- **WeekView** - Shows events for a week (basic implementation)
- **DayView** - Shows events for a single day (basic implementation)

### Event Components
- **EventCard** - Displays a single event (used in calendar and lists)
- **EventForm** - Form for creating/editing events
- **EventList** - List of all events
- **EventFilters** - Search and filter controls

### Layout Components
- **RootLayout** - Main app layout with navigation
- **CalendarLayout** - Layout specific to calendar views

## How It All Works Together

1. **App.tsx** is the main entry point that sets up routing and drag-and-drop
2. **CalendarProvider** wraps the app and provides calendar state to all components
3. Each page uses the appropriate hooks to get and manage data
4. Components communicate through context and props
5. All event data is stored in localStorage through the storageService

## Data Storage

I'm using localStorage to store events, which means:
- Data persists between browser sessions
- No backend server needed
- Export/import functionality for backing up data
- Sample events are created for new users

The storage service is in `src/services/storageService.ts`.

## Features I'm Proud Of

### Drag and Drop
You can drag events from one date to another! This uses @dnd-kit and was really challenging to implement properly.

### Recurring Events  
Events can repeat daily, weekly, or monthly. The recurrence logic is in `src/services/recurrenceService.ts`.

### Responsive Design
The app works on mobile and desktop. I used Tailwind's responsive classes throughout.

### Form Validation
All forms use React Hook Form with Zod validation to make sure data is correct.

### Search and Filtering
You can search events by title/description and filter by category.

## Known Issues / TODO

- Week and Day views are basic (mostly placeholders)
- No user authentication (everything is local)
- No notifications/reminders yet
- Could use better error handling in some places
- Mobile drag-and-drop could be improved

## How to Run

1. Clone the repo
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5173`

For deployment:
- `npm run build` - Builds for production  
- `npm run deploy` - Deploys to GitHub Pages

## What I Learned

This was a great learning project! I got experience with:
- Complex state management with custom hooks
- Drag and drop interactions
- Date manipulation (dates in JavaScript are hard!)
- TypeScript in a real project
- Form handling and validation
- Local storage and data persistence
- Responsive design with Tailwind

The hardest parts were getting the drag-and-drop working correctly and handling all the edge cases with dates and recurring events.

## Contributing

If you want to improve anything, feel free to submit a PR! The code could definitely use some cleanup in places.

---

*This README was written by a developer who's still learning, so if you see any mistakes or have suggestions for improvement, please let me know!*
