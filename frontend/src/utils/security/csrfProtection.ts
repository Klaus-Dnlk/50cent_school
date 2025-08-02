import { secureStorage } from './secureStorage';

/**
 * Generates CSRF token
 * @returns CSRF token
 */
function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Class for managing CSRF protection
 */
class CSRFProtection {
  private readonly TOKEN_KEY = 'csrf_token';
  private readonly HEADER_NAME = 'X-CSRF-Token';

  /**
   * Generates and stores new CSRF token
   * @returns generated token
   */
  generateToken(): string {
    const token = generateCSRFToken();
    secureStorage.setSessionItem(this.TOKEN_KEY, token);
    return token;
  }

  /**
   * Gets current CSRF token
   * @returns CSRF token or null
   */
  getToken(): string | null {
    return secureStorage.getSessionItem(this.TOKEN_KEY);
  }

  /**
   * Validates CSRF token
   * @param token - token to validate
   * @returns true if token is valid
   */
  validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token;
  }

  /**
   * Gets header for CSRF token
   * @returns object with header
   */
  getCSRFHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { [this.HEADER_NAME]: token } : {};
  }

  /**
   * Clears CSRF token
   */
  clearToken(): void {
    secureStorage.removeSessionItem(this.TOKEN_KEY);
  }
}

export const csrfProtection = new CSRFProtection(); 