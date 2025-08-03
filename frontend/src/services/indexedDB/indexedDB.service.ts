import { openDB, IDBPDatabase } from 'idb';

// Database configuration
const DB_NAME = '50cent_school_db';
const DB_VERSION = 1;

// Store names
export const STORES = {
  CREDITS: 'credits',
  INVESTMENTS: 'investments',
  USER_DATA: 'user_data',
  CACHE: 'cache',
  OFFLINE_FORMS: 'offline_forms'
} as const;

// Database schema
interface DatabaseSchema {
  [STORES.CREDITS]: {
    key: string;
    value: any;
    indexes: { 'by-date': Date };
  };
  [STORES.INVESTMENTS]: {
    key: string;
    value: any;
    indexes: { 'by-user': string; 'by-date': Date };
  };
  [STORES.USER_DATA]: {
    key: string;
    value: any;
    indexes: { 'by-type': string };
  };
  [STORES.CACHE]: {
    key: string;
    value: any;
    indexes: { 'by-url': string; 'by-date': Date };
  };
  [STORES.OFFLINE_FORMS]: {
    key: string;
    value: any;
    indexes: { 'by-type': string; 'by-date': Date };
  };
}

class IndexedDBService {
  private db: IDBPDatabase<DatabaseSchema> | null = null;

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    try {
      this.db = await openDB<DatabaseSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Credits store
          if (!db.objectStoreNames.contains(STORES.CREDITS)) {
            const creditsStore = db.createObjectStore(STORES.CREDITS, { keyPath: 'key' });
            creditsStore.createIndex('by-date', 'date');
          }

          // Investments store
          if (!db.objectStoreNames.contains(STORES.INVESTMENTS)) {
            const investmentsStore = db.createObjectStore(STORES.INVESTMENTS, { keyPath: 'key' });
            investmentsStore.createIndex('by-user', 'userId');
            investmentsStore.createIndex('by-date', 'date');
          }

          // User data store
          if (!db.objectStoreNames.contains(STORES.USER_DATA)) {
            const userDataStore = db.createObjectStore(STORES.USER_DATA, { keyPath: 'key' });
            userDataStore.createIndex('by-type', 'type');
          }

          // Cache store
          if (!db.objectStoreNames.contains(STORES.CACHE)) {
            const cacheStore = db.createObjectStore(STORES.CACHE, { keyPath: 'key' });
            cacheStore.createIndex('by-url', 'url');
            cacheStore.createIndex('by-date', 'date');
          }

          // Offline forms store
          if (!db.objectStoreNames.contains(STORES.OFFLINE_FORMS)) {
            const offlineFormsStore = db.createObjectStore(STORES.OFFLINE_FORMS, { keyPath: 'key' });
            offlineFormsStore.createIndex('by-type', 'type');
            offlineFormsStore.createIndex('by-date', 'date');
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Get database instance
   */
  public async getDB(): Promise<IDBPDatabase<DatabaseSchema>> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  /**
   * Store credits data
   */
  async storeCredits(credits: any[]): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.CREDITS, 'readwrite');
      const store = tx.objectStore(STORES.CREDITS);

      // Clear existing data
      await store.clear();

      // Store new data
      for (const credit of credits) {
        await store.put({
          key: `credit_${credit.id || Date.now()}`,
          value: credit,
          date: new Date()
        });
      }

      await tx.done;
    } catch (error) {
      console.error('Failed to store credits:', error);
      throw error;
    }
  }

  /**
   * Get cached credits
   */
  async getCredits(): Promise<any[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.CREDITS, 'readonly');
      const store = tx.objectStore(STORES.CREDITS);
      
      const allCredits = await store.getAll();
      return allCredits.map(item => item.value);
    } catch (error) {
      console.error('Failed to get credits:', error);
      return [];
    }
  }

  /**
   * Store investment data
   */
  async storeInvestment(investment: any, userId?: string): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.INVESTMENTS, 'readwrite');
      const store = tx.objectStore(STORES.INVESTMENTS);

      await store.put({
        key: `investment_${investment.id || Date.now()}`,
        value: investment,
        userId: userId || 'anonymous',
        date: new Date()
      });

      await tx.done;
    } catch (error) {
      console.error('Failed to store investment:', error);
      throw error;
    }
  }

  /**
   * Get user investments
   */
  async getUserInvestments(userId?: string): Promise<any[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.INVESTMENTS, 'readonly');
      const store = tx.objectStore(STORES.INVESTMENTS);
      const index = store.index('by-user');

      const investments = await index.getAll(userId || 'anonymous');
      return investments.map(item => item.value);
    } catch (error) {
      console.error('Failed to get user investments:', error);
      return [];
    }
  }

  /**
   * Cache API response
   */
  async cacheResponse(url: string, data: any, ttl: number = 3600000): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.CACHE, 'readwrite');
      const store = tx.objectStore(STORES.CACHE);

      await store.put({
        key: `cache_${btoa(url)}`,
        value: data,
        url,
        date: new Date(),
        ttl: Date.now() + ttl
      });

      await tx.done;
    } catch (error) {
      console.error('Failed to cache response:', error);
      throw error;
    }
  }

  /**
   * Get cached response
   */
  async getCachedResponse(url: string): Promise<any | null> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.CACHE, 'readonly');
      const store = tx.objectStore(STORES.CACHE);
      const index = store.index('by-url');

      const cached = await index.get(url);
      
      if (!cached || cached.ttl < Date.now()) {
        return null;
      }

      return cached.value;
    } catch (error) {
      console.error('Failed to get cached response:', error);
      return null;
    }
  }

  /**
   * Store offline form
   */
  async storeOfflineForm(formType: string, formData: any): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.OFFLINE_FORMS, 'readwrite');
      const store = tx.objectStore(STORES.OFFLINE_FORMS);

      await store.put({
        key: `form_${formType}_${Date.now()}`,
        value: formData,
        type: formType,
        date: new Date()
      });

      await tx.done;
    } catch (error) {
      console.error('Failed to store offline form:', error);
      throw error;
    }
  }

  /**
   * Get offline forms by type
   */
  async getOfflineForms(formType?: string): Promise<any[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.OFFLINE_FORMS, 'readonly');
      const store = tx.objectStore(STORES.OFFLINE_FORMS);

      let forms;
      if (formType) {
        const index = store.index('by-type');
        forms = await index.getAll(formType);
      } else {
        forms = await store.getAll();
      }

      return forms.map(item => item.value);
    } catch (error) {
      console.error('Failed to get offline forms:', error);
      return [];
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.CACHE, 'readwrite');
      const store = tx.objectStore(STORES.CACHE);

      const allCache = await store.getAll();
      const now = Date.now();

      for (const item of allCache) {
        if (item.ttl < now) {
          await store.delete(item.key);
        }
      }

      await tx.done;
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    try {
      const db = await this.getDB();
      await db.clear(STORES.CREDITS);
      await db.clear(STORES.INVESTMENTS);
      await db.clear(STORES.USER_DATA);
      await db.clear(STORES.CACHE);
      await db.clear(STORES.OFFLINE_FORMS);
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }
}

export const indexedDBService = new IndexedDBService(); 