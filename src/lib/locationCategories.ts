export const LOCATION_CATEGORIES = [
    { value: 'room', label: 'Room', icon: '🏠' },
    { value: 'facility', label: 'Facility', icon: '🏢' },
    { value: 'office', label: 'Office', icon: '💼' },
    { value: 'meeting', label: 'Meeting Room', icon: '🤝' },
    { value: 'dining', label: 'Dining', icon: '🍽️' },
    { value: 'study', label: 'Study Area', icon: '📚' },
    { value: 'entrance', label: 'Entrance', icon: '🚪' }
  ] as const;
  
  export type LocationCategoryValue = typeof LOCATION_CATEGORIES[number]['value'];
  
  export const getCategoryLabel = (value: string): string => {
    const category = LOCATION_CATEGORIES.find(cat => cat.value === value);
    return category?.label || value;
  };
  
  export const getCategoryIcon = (value: string): string => {
    const category = LOCATION_CATEGORIES.find(cat => cat.value === value);
    return category?.icon || '📍';
  };
  