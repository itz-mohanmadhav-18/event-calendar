import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

export const TopNavbar: React.FC = () => {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
              <Calendar className="h-6 w-6" />
              Event Calendar
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1">
              <Link to="/calendar/month">
                <Button variant="ghost" size="sm">
                  Calendar
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="ghost" size="sm">
                  Events
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  Settings
                </Button>
              </Link>
            </nav>
            
            <Link to="/events/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
