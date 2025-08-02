import DOMPurify from 'dompurify';

// DOMPurify configuration for maximum security
const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
};

/**
 * Sanitizes HTML string for safe display
 * @param dirty - dirty HTML string
 * @returns sanitized HTML string
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) return '';
  
  try {
    return DOMPurify.sanitize(dirty, PURIFY_CONFIG);
  } catch (error) {
    console.error('HTML sanitization failed:', error);
    return '';
  }
}

/**
 * Sanitizes text by removing all HTML tags
 * @param dirty - dirty text
 * @returns clean text without HTML
 */
export function sanitizeText(dirty: string): string {
  if (!dirty) return '';
  
  try {
    return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
  } catch (error) {
    console.error('Text sanitization failed:', error);
    return '';
  }
}

/**
 * Sanitizes URL for safe usage
 * @param url - URL to sanitize
 * @returns sanitized URL or empty string
 */
export function sanitizeURL(url: string): string {
  if (!url) return '';
  
  try {
    // Check if it's a valid URL
    const urlObj = new URL(url, window.location.origin);
    
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('URL sanitization failed:', error);
    return '';
  }
}

/**
 * Sanitizes object for safe usage in React
 * @param obj - object to sanitize
 * @returns sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
} 