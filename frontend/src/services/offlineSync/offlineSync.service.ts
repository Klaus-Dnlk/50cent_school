import { indexedDBService } from '@/services/indexedDB';
import { createAxiosInstance } from '@/api/base';
import { Config } from '@/config';
import { appStorage } from '@/services/appStorage';

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

class OfflineSyncService {
  private isOnline = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingForms();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Store form data for offline submission
   */
  async storeOfflineForm(formType: string, formData: any): Promise<void> {
    try {
      await indexedDBService.storeOfflineForm(formType, {
        ...formData,
        timestamp: new Date().toISOString(),
        retryCount: 0,
        maxRetries: 3
      });
    } catch (error) {
      console.error('Failed to store offline form:', error);
      throw error;
    }
  }

  /**
   * Submit form immediately if online, otherwise store for later
   */
  async submitForm(formType: string, formData: any, apiEndpoint: string): Promise<any> {
    if (this.isOnline) {
      try {
        // Try to submit immediately
        const apiToken = await appStorage.getApiToken();
        const baseURL = `${Config.API_BASEURL}/api/v1`;
        const api = createAxiosInstance({ apiToken: apiToken || '', baseURL });
        
        const response = await api.request({
          method: 'post',
          url: apiEndpoint,
          data: formData
        });
        return response.data;
      } catch (error) {
        console.warn('Online submission failed, storing for offline sync:', error);
        // Fall back to offline storage
        await this.storeOfflineForm(formType, formData);
        throw error;
      }
    } else {
      // Store for offline sync
      await this.storeOfflineForm(formType, formData);
      throw new Error('Form stored for offline submission');
    }
  }

  /**
   * Sync all pending offline forms
   */
  async syncPendingForms(): Promise<SyncResult> {
    if (!this.isOnline) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        errors: ['Not online']
      };
    }

    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: []
    };

    try {
      const offlineForms = await indexedDBService.getOfflineForms();
      
      for (const form of offlineForms) {
        try {
          // Determine API endpoint based on form type
          const endpoint = this.getEndpointForFormType(form.type);
          
          if (!endpoint) {
            result.errors.push(`Unknown form type: ${form.type}`);
            result.failed++;
            continue;
          }

          // Submit form
          const apiToken = await appStorage.getApiToken();
          const baseURL = `${Config.API_BASEURL}/api/v1`;
          const api = createAxiosInstance({ apiToken: apiToken || '', baseURL });
          
          await api.request({
            method: 'post',
            url: endpoint,
            data: form.data
          });

          // Remove from offline storage on success
          await this.removeOfflineForm(form.key);
          result.synced++;
        } catch (error) {
          console.error(`Failed to sync form ${form.key}:`, error);
          result.errors.push(`Form ${form.key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.failed++;
          
          // Increment retry count
          form.retryCount = (form.retryCount || 0) + 1;
          
          // Remove if max retries exceeded
          if (form.retryCount >= form.maxRetries) {
            await this.removeOfflineForm(form.key);
            result.errors.push(`Form ${form.key}: Max retries exceeded`);
          }
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Get API endpoint for form type
   */
  private getEndpointForFormType(formType: string): string | null {
    const endpoints: Record<string, string> = {
      'credit_application': '/loans/apply',
      'investment_form': '/investments/create',
      'consumer_form': '/consumers/create',
      'investor_form': '/investors/register'
    };

    return endpoints[formType] || null;
  }

  /**
   * Remove offline form by key
   */
  private async removeOfflineForm(key: string): Promise<void> {
    try {
      const db = await indexedDBService.getDB();
      const tx = db.transaction('offline_forms', 'readwrite');
      const store = tx.objectStore('offline_forms');
      await store.delete(key);
      await tx.done;
    } catch (error) {
      console.error('Failed to remove offline form:', error);
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    pending: number;
    lastSync: Date | null;
    isOnline: boolean;
  }> {
    const offlineForms = await indexedDBService.getOfflineForms();
    
    return {
      pending: offlineForms.length,
      lastSync: null, // Could be stored in IndexedDB
      isOnline: this.isOnline
    };
  }

  /**
   * Clear all pending forms
   */
  async clearPendingForms(): Promise<void> {
    try {
      const offlineForms = await indexedDBService.getOfflineForms();
      for (const form of offlineForms) {
        await this.removeOfflineForm(form.key);
      }
    } catch (error) {
      console.error('Failed to clear pending forms:', error);
      throw error;
    }
  }
}

export const offlineSyncService = new OfflineSyncService(); 