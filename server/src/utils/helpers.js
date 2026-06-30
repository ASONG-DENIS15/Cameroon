import { v4 as uuidv4 } from 'uuid';

/**
 * Generate Unique ID
 */
export const generateId = () => {
  return uuidv4();
};

/**
 * Generate Booking Number
 */
export const generateBookingNumber = () => {
  return `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Generate Slug from Title
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Format Currency
 */
export const formatCurrency = (amount, currency = 'XAF') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format Date
 */
export const formatDate = (date, locale = 'en-US') => {
  return new Date(date).toLocaleDateString(locale);
};

/**
 * Calculate Days Difference
 */
export const daysDifference = (date1, date2) => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
};

/**
 * Calculate Distance Between Coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Paginate Results
 */
export const paginate = (items, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: items.slice(start, end),
    pagination: {
      page,
      limit,
      total: items.length,
      pages: Math.ceil(items.length / limit)
    }
  };
};

export default {
  generateId,
  generateBookingNumber,
  generateSlug,
  formatCurrency,
  formatDate,
  daysDifference,
  calculateDistance,
  paginate
};
