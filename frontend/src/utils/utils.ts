import { DATE_FORMATTER } from '~/config.mjs';

const formatter =
  DATE_FORMATTER ||
  new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

/* eslint-disable no-mixed-spaces-and-tabs */
export const getFormattedDate = (date: Date | string | null | undefined) => {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided to getFormattedDate:', date);
      return '';
    }
    
    return formatter.format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error, 'Date value:', date);
    return '';
  }
};

export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const processAccentColor = (color: string | null | undefined): string => {
  if (!color) return 'rgba(126, 107, 235, 1)'; // Default color
  
  // If it's already in rgba format, return as is
  if (color.startsWith('rgba')) {
    return color;
  }
  
  // If it's a hex color, convert to rgba
  if (color.startsWith('#')) {
    return hexToRgba(color);
  }
  
  // Default fallback
  return 'rgba(126, 107, 235, 1)';
};
