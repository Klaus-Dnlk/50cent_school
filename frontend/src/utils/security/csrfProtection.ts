import { secureStorage } from './secureStorage';

function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

class CSRFProtection {
  private readonly TOKEN_KEY = 'csrf_token';
  private readonly HEADER_NAME = 'X-CSRF-Token';

  generateToken(): string {
    const token = generateCSRFToken();
    secureStorage.setSessionItem(this.TOKEN_KEY, token);
    return token;
  }

  getToken(): string | null {
    return secureStorage.getSessionItem(this.TOKEN_KEY);
  }

  validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token;
  }

  getCSRFHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { [this.HEADER_NAME]: token } : {};
  }

  clearToken(): void {
    secureStorage.removeSessionItem(this.TOKEN_KEY);
  }
}

export const csrfProtection = new CSRFProtection(); 