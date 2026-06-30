import { REGEX } from '../config/constants.js';

/**
 * Validate Email
 */
export const validateEmail = (email) => {
  return REGEX.EMAIL.test(email);
};

/**
 * Validate Password Strength
 */
export const validatePassword = (password) => {
  return REGEX.STRONG_PASSWORD.test(password);
};

/**
 * Validate Phone Number
 */
export const validatePhone = (phone) => {
  return REGEX.PHONE.test(phone);
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  return REGEX.URL.test(url);
};

/**
 * Validate Slug
 */
export const validateSlug = (slug) => {
  return REGEX.SLUG.test(slug);
};

/**
 * Sanitize String (basic XSS prevention)
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate Pagination
 */
export const validatePagination = (page, limit) => {
  const p = parseInt(page) || 1;
  const l = Math.min(parseInt(limit) || 10, 100);
  return {
    page: Math.max(p, 1),
    limit: Math.max(l, 1),
    offset: (Math.max(p, 1) - 1) * Math.max(l, 1)
  };
};
