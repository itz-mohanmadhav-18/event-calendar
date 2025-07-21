import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, List, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { 
      label: 'Month View', 
      href: '/calendar/month', 
      icon: Calendar,
      active: location.pathname.startsWith('/calendar/month')
    },
    { 
      label: 'Week View', 
      href: '/calendar/week', 
      icon: Calendar,
      active: location.pathname.startsWith('/calendar/week')
    },
    { 
      label: 'Day View', 
      href: '/calendar/day', 
      icon: Calendar,
      active: location.pathname.startsWith('/calendar/day')
    },
    { 
      label: 'All Events', 
      href: '/events', 
      icon: List,
      active: location.pathname.startsWith('/events')
    },
    { 
      label: 'Settings', 
      href: '/settings', 
      icon: Settings,
      active: location.pathname.startsWith('/settings')
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Navigation</span>
          <Link to="/events/new">
            <Button size="sm" className="h-7 w-7 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  item.active && "bg-secondary"
                )}
              >
                <IconComponent className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
};
