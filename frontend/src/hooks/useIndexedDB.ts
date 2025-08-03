import { useState, useEffect, useCallback } from 'react';
import { indexedDBService } from '@/services/indexedDB';

export function useIndexedDB() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize IndexedDB on mount
  useEffect(() => {
    const initDB = async () => {
      try {
        setIsLoading(true);
        await indexedDBService.init();
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize IndexedDB');
        console.error('IndexedDB initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  // Credits operations
  const storeCredits = useCallback(async (credits: any[]) => {
    try {
      setError(null);
      await indexedDBService.storeCredits(credits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to store credits');
      throw err;
    }
  }, []);

  const getCredits = useCallback(async () => {
    try {
      setError(null);
      return await indexedDBService.getCredits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get credits');
      return [];
    }
  }, []);

  // Investment operations
  const storeInvestment = useCallback(async (investment: any, userId?: string) => {
    try {
      setError(null);
      await indexedDBService.storeInvestment(investment, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to store investment');
      throw err;
    }
  }, []);

  const getUserInvestments = useCallback(async (userId?: string) => {
    try {
      setError(null);
      return await indexedDBService.getUserInvestments(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get investments');
      return [];
    }
  }, []);

  // Cache operations
  const cacheResponse = useCallback(async (url: string, data: any, ttl?: number) => {
    try {
      setError(null);
      await indexedDBService.cacheResponse(url, data, ttl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cache response');
      throw err;
    }
  }, []);

  const getCachedResponse = useCallback(async (url: string) => {
    try {
      setError(null);
      return await indexedDBService.getCachedResponse(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get cached response');
      return null;
    }
  }, []);

  // Offline forms operations
  const storeOfflineForm = useCallback(async (formType: string, formData: any) => {
    try {
      setError(null);
      await indexedDBService.storeOfflineForm(formType, formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to store offline form');
      throw err;
    }
  }, []);

  const getOfflineForms = useCallback(async (formType?: string) => {
    try {
      setError(null);
      return await indexedDBService.getOfflineForms(formType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get offline forms');
      return [];
    }
  }, []);

  // Utility operations
  const clearExpiredCache = useCallback(async () => {
    try {
      setError(null);
      await indexedDBService.clearExpiredCache();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear expired cache');
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      setError(null);
      await indexedDBService.clearAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear all data');
      throw err;
    }
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    storeCredits,
    getCredits,
    storeInvestment,
    getUserInvestments,
    cacheResponse,
    getCachedResponse,
    storeOfflineForm,
    getOfflineForms,
    clearExpiredCache,
    clearAll
  };
} 