{/* This is the category filter. I used a select dropdown so you can pick which category to filter by. I just put all the categories in an array. */}
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useEventFilters } from '@/hooks/useEventFilters';

export const EventFilters: React.FC = () => {
  const { events } = useEvents();
  const { selectedCategory, setSelectedCategory, categories, clearFilters } = useEventFilters(events);

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div>
        <label className="text-sm font-medium text-muted-foreground block mb-2">
          Filter by Category
        </label>
        <Select 
          value={selectedCategory || 'all'} 
          onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applied Filters */}
      {selectedCategory && (
        <div className="pt-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Applied Filters:
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setSelectedCategory(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-6"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};