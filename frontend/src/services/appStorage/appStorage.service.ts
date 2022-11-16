export type AppStorageSchema = {
  apiToken?: string;
};

class AppStorage {
  private async get(
    key: keyof AppStorageSchema,
  ): Promise<AppStorageSchema[keyof AppStorageSchema] | undefined> {
    return localStorage.getItem(
      key as string,
    ) as unknown as AppStorageSchema[keyof AppStorageSchema];
  }

  private async set(
    key: keyof AppStorageSchema,
    value: AppStorageSchema[keyof AppStorageSchema],
  ): Promise<void> {
    localStorage.setItem(key as string, value as unknown as string);
  }

  async getApiToken(): Promise<string> {
    return (await this.get('apiToken')) || '';
  }

  async setApiKey(apiToken: string) {
    return await this.set('apiToken', apiToken);
  }
}

export const appStorage = new AppStorage();
