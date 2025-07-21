import { useState, useMemo, useCallback } from 'react';
import type { Event } from '@/types/index';

interface UseEventFiltersReturn {
  searchQuery: string;
  selectedCategory: string | null;
  filteredEvents: Event[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  clearFilters: () => void;
  categories: string[];
}

export const useEventFilters = (events: Event[]): UseEventFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    events.forEach(event => {
      if (event.category) {
        categorySet.add(event.category);
      }
    });
    return Array.from(categorySet);
  }, [events]);


  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));

     
      const matchesCategory = !selectedCategory || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
  }, []);

  return {
    searchQuery,
    selectedCategory,
    filteredEvents,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
    categories,
  };
};