import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
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
import { useEvents } from './hooks/useEvents';
import { useDragDrop } from './hooks/useDragDrop';

function App() {
  const { updateEvent } = useEvents();

  const {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragDrop();

  const handleEventMove = async (eventId: string, newDate: Date) => {
    try {
      const { formatDate } = await import('./utils/dateUtils');
      await updateEvent(eventId, { date: formatDate(newDate) });
    } catch (error) {
      console.error('Failed to move event:', error);
    }
  };

  return (
    <BrowserRouter>
      <CalendarProvider>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={(event) => handleDragEnd(event, handleEventMove)}
          onDragCancel={handleDragCancel}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/calendar/month" replace />} />
            
            <Route path="/" element={<RootLayout><CalendarLayout><MonthView /></CalendarLayout></RootLayout>} />
            <Route path="/calendar/month" element={<RootLayout><CalendarLayout><MonthView /></CalendarLayout></RootLayout>} />
            <Route path="/calendar/week" element={<RootLayout><CalendarLayout><WeekView /></CalendarLayout></RootLayout>} />
            <Route path="/calendar/day" element={<RootLayout><CalendarLayout><DayView /></CalendarLayout></RootLayout>} />
            
            <Route path="/events" element={<RootLayout><EventsPage /></RootLayout>} />
            <Route path="/events/new" element={<RootLayout><NewEventPage /></RootLayout>} />
            <Route path="/events/:eventId/edit" element={<RootLayout><EditEventPage /></RootLayout>} />
            
            <Route path="/settings" element={<RootLayout><SettingsPage /></RootLayout>} />
          </Routes>
        </DndContext>
      </CalendarProvider>
    </BrowserRouter>
  );
}

export default App;