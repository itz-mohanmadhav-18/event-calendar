import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CalendarProvider } from './contexts/CalendarContext';
import { RootLayout } from './components/layout/RootLayout';
import { CalendarLayout } from './components/layout/CalendarLayout';
import { MonthView } from './components/calendar/Monthview';
import { WeekView } from './components/calendar/WeekView';
import { DayView } from './components/calendar/Dayview';
import { EventsPage } from './pages/EventsPage';
import { NewEventPage } from './pages/NewEventPage';
import { EditEventPage } from './pages/EditEventPage';
import { SettingsPage } from './pages/SettingsPage';
import { EventCard } from './components/events/EventCard';
import { useEvents } from './hooks/useEvents';
import { useDragDrop } from './hooks/useDragDrop';

{/* Main app with routing and drag-and-drop functionality */}
function App() {
  const { updateEvent } = useEvents();

  const {
    activeEvent,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragDrop();

  const handleEventMove = async (eventId: string, newDate: Date) => {
    try {
      const { formatDate } = await import('./utils/dateUtils');
      await updateEvent(eventId, { date: formatDate(newDate) });
    } catch (error) {
      // Silently fail - drag operation will revert
    }
  };

  const basename = import.meta.env.BASE_URL.slice(0, -1);

  return (
    <BrowserRouter basename={basename}>
      <CalendarProvider>
        {/* Global drag and drop context for moving events */}
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={(event) => handleDragEnd(event, handleEventMove)}
          onDragCancel={handleDragCancel}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/calendar/month" replace />} />
            
            {/* Calendar views */}
            <Route path="/calendar/month" element={<RootLayout><CalendarLayout><MonthView /></CalendarLayout></RootLayout>} />
            <Route path="/calendar/week" element={<RootLayout><CalendarLayout><WeekView /></CalendarLayout></RootLayout>} />
            <Route path="/calendar/day" element={<RootLayout><CalendarLayout><DayView /></CalendarLayout></RootLayout>} />
            
            {/* Event management pages */}
            <Route path="/events" element={<RootLayout><EventsPage /></RootLayout>} />
            <Route path="/events/new" element={<RootLayout><NewEventPage /></RootLayout>} />
            <Route path="/events/:eventId/edit" element={<RootLayout><EditEventPage /></RootLayout>} />
            
            <Route path="/settings" element={<RootLayout><SettingsPage /></RootLayout>} />
          </Routes>
          
          {/* Visual feedback during drag operations */}
          <DragOverlay>
            {activeEvent ? (
              <EventCard
                event={activeEvent}
                variant="default"
                onClick={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </CalendarProvider>
    </BrowserRouter>
  );
}

export default App;