import { secureStorage } from '@/utils/security';

export type AppStorageSchema = {
  apiToken?: string;
};

class AppStorage {
  private async get(
    key: keyof AppStorageSchema,
  ): Promise<AppStorageSchema[keyof AppStorageSchema] | undefined> {
    // Use secure storage for tokens
    if (key === 'apiToken') {
      return secureStorage.getToken() || '';
    }
    
    return localStorage.getItem(
      key as string,
    ) as unknown as AppStorageSchema[keyof AppStorageSchema];
  }

  private async set(
    key: keyof AppStorageSchema,
    value: AppStorageSchema[keyof AppStorageSchema],
  ): Promise<void> {
    // Use secure storage for tokens
    if (key === 'apiToken') {
      secureStorage.setToken(value as string);
      return;
    }
    
    localStorage.setItem(key as string, value as unknown as string);
  }

  async getApiToken(): Promise<string> {
    return (await this.get('apiToken')) || '';
  }

  async setApiKey(apiToken: string) {
    return await this.set('apiToken', apiToken);
  }

  async removeApiToken(): Promise<void> {
    secureStorage.removeToken();
  }

  async clearAll(): Promise<void> {
    secureStorage.clearSession();
    localStorage.clear();
  }
}

export const appStorage = new AppStorage();
