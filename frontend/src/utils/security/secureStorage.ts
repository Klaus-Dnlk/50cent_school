import CryptoJS from 'crypto-js';

// Encryption key (should be stored securely in production)
const ENCRYPTION_KEY = process.env.REACT_APP_STORAGE_KEY || 'default-key-change-in-production';

/**
 * Secure data storage with encryption
 */
class SecureStorage {
  private encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return '';
    }
  }

  private decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  /**
   * Stores data in sessionStorage with encryption
   * @param key - storage key
   * @param value - value to store
   */
  setSessionItem(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value);
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to set session item:', error);
    }
  }

  /**
   * Retrieves data from sessionStorage with decryption
   * @param key - key to retrieve
   * @returns decrypted value or null
   */
  getSessionItem(key: string): string | null {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Failed to get session item:', error);
      return null;
    }
  }

  /**
   * Removes data from sessionStorage
   * @param key - key to remove
   */
  removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove session item:', error);
    }
  }

  /**
   * Clears all data from sessionStorage
   */
  clearSession(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  /**
   * Securely stores authentication token
   * @param token - JWT token
   */
  setToken(token: string): void {
    this.setSessionItem('auth_token', token);
  }

  /**
   * Securely retrieves authentication token
   * @returns JWT token or null
   */
  getToken(): string | null {
    return this.getSessionItem('auth_token');
  }

  /**
   * Removes authentication token
   */
  removeToken(): void {
    this.removeSessionItem('auth_token');
  }

  /**
   * Checks if token exists
   * @returns true if token exists
   */
  hasToken(): boolean {
    return this.getToken() !== null;
  }
}

export const secureStorage = new SecureStorage(); 