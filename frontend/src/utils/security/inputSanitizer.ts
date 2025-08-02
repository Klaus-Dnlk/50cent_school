import { sanitizeText, sanitizeURL } from './domSanitizer';

/**
 * Input sanitization for forms
 */
export class InputSanitizer {
  /**
   * Sanitizes email address
   * @param email - email to sanitize
   * @returns sanitized email or empty string
   */
  static sanitizeEmail(email: string): string {
    if (!email) return '';
    
    const sanitized = sanitizeText(email.trim().toLowerCase());
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Sanitizes password
   * @param password - password to sanitize
   * @returns sanitized password
   */
  static sanitizePassword(password: string): string {
    if (!password) return '';
    
    // Remove leading and trailing whitespace
    return password.trim();
  }

  /**
   * Sanitizes user name
   * @param name - name to sanitize
   * @returns sanitized name
   */
  static sanitizeName(name: string): string {
    if (!name) return '';
    
    const sanitized = sanitizeText(name.trim());
    
    // Allow only letters, spaces and hyphens
    return sanitized.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄ\s-]/g, '');
  }

  /**
   * Sanitizes phone number
   * @param phone - phone number to sanitize
   * @returns sanitized phone number
   */
  static sanitizePhone(phone: string): string {
    if (!phone) return '';
    
    const sanitized = sanitizeText(phone.trim());
    
    // Remove all characters except digits, +, -, (, ), spaces
    return sanitized.replace(/[^\d+\-()\s]/g, '');
  }

  /**
   * Sanitizes URL
   * @param url - URL to sanitize
   * @returns sanitized URL or empty string
   */
  static sanitizeUrl(url: string): string {
    return sanitizeURL(url);
  }

  /**
   * Sanitizes text content
   * @param text - text to sanitize
   * @param maxLength - maximum length
   * @returns sanitized text
   */
  static sanitizeText(text: string, maxLength?: number): string {
    if (!text) return '';
    
    let sanitized = sanitizeText(text.trim());
    
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    
    return sanitized;
  }

  /**
   * Sanitizes numeric value
   * @param value - value to sanitize
   * @param min - minimum value
   * @param max - maximum value
   * @returns sanitized number or null
   */
  static sanitizeNumber(value: string | number, min?: number, max?: number): number | null {
    if (value === '' || value === null || value === undefined) return null;
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return null;
    
    if (min !== undefined && num < min) return null;
    if (max !== undefined && num > max) return null;
    
    return num;
  }

  /**
   * Sanitizes file
   * @param file - file to validate
   * @param allowedTypes - allowed file types
   * @param maxSize - maximum size in bytes
   * @returns file or null
   */
  static sanitizeFile(
    file: File, 
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxSize: number = 5 * 1024 * 1024 // 5MB
  ): File | null {
    if (!file) return null;
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return null;
    }
    
    // Check file size
    if (file.size > maxSize) {
      return null;
    }
    
    return file;
  }

  /**
   * Sanitizes form data object
   * @param formData - form data
   * @returns sanitized form data
   */
  static sanitizeFormData<T extends Record<string, any>>(formData: T): T {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        switch (key.toLowerCase()) {
          case 'email':
            sanitized[key] = this.sanitizeEmail(value);
            break;
          case 'password':
            sanitized[key] = this.sanitizePassword(value);
            break;
          case 'name':
          case 'firstname':
          case 'lastname':
          case 'surname':
            sanitized[key] = this.sanitizeName(value);
            break;
          case 'phone':
          case 'telephone':
            sanitized[key] = this.sanitizePhone(value);
            break;
          case 'url':
          case 'website':
            sanitized[key] = this.sanitizeUrl(value);
            break;
          default:
            sanitized[key] = this.sanitizeText(value);
        }
      } else if (typeof value === 'number') {
        sanitized[key] = this.sanitizeNumber(value);
      } else if (value instanceof File) {
        sanitized[key] = this.sanitizeFile(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeFormData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized as T;
  }
} 