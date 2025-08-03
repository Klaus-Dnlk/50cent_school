import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getAllCreditsWithCacheApi } from '@/api/credit/getCredits/getAllCreditsWithCache.api';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { api } from '@/api/api';

interface UseCreditsWithCacheOptions {
  page?: number;
  pageSize?: number;
  enableCache?: boolean;
}

export function useCreditsWithCache(options: UseCreditsWithCacheOptions = {}) {
  const {
    page = 1,
    pageSize = 10,
    enableCache = true
  } = options;

  const queryClient = useQueryClient();
  const { isInitialized, storeCredits, getCredits } = useIndexedDB();
  const [isOffline, setIsOffline] = useState(false);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Query for credits with caching
  const query = useQuery(
    ['credits', page, pageSize],
    async () => {
      if (isOffline && enableCache) {
        // Try to get from IndexedDB when offline
        const cachedCredits = await getCredits();
        if (cachedCredits.length > 0) {
          console.log('Serving credits from IndexedDB (offline mode)');
          return {
            data: cachedCredits,
            total: cachedCredits.length,
            page: 1,
            page_size: cachedCredits.length
          };
        }
        throw new Error('No cached credits available');
      }

      // Use cached API or fetch from server
      const apiFunction = enableCache ? getAllCreditsWithCacheApi : getAllCreditsApi;
      const response = await apiFunction(api, page, pageSize);

      // Store in IndexedDB for offline access
      if (enableCache && isInitialized && response.data) {
        try {
          await storeCredits(response.data);
        } catch (error) {
          console.warn('Failed to store credits in IndexedDB:', error);
        }
      }

      return response;
    },
    {
      enabled: !isOffline || enableCache,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry if offline and no cache available
        if (isOffline && !enableCache) return false;
        return failureCount < 3;
      },
      onError: (error) => {
        console.error('Failed to fetch credits:', error);
      }
    }
  );

  // Function to refresh data
  const refresh = useCallback(() => {
    queryClient.invalidateQueries(['credits', page, pageSize]);
  }, [queryClient, page, pageSize]);

  // Function to prefetch next page
  const prefetchNextPage = useCallback(() => {
    const nextPage = page + 1;
    queryClient.prefetchQuery(
      ['credits', nextPage, pageSize],
      () => getAllCreditsWithCacheApi(api, nextPage, pageSize)
    );
  }, [queryClient, page, pageSize]);

  return {
    ...query,
    isOffline,
    refresh,
    prefetchNextPage,
    data: query.data?.data || [],
    total: query.data?.total || 0,
    page: query.data?.page || page,
    pageSize: query.data?.page_size || pageSize
  };
}

// Fallback API function for non-cached requests
async function getAllCreditsApi(api: any, page: number, pageSize: number) {
  const { data } = await api.request({
    method: 'get',
    url: `/loans?page=${page}&page_size=${pageSize}`
  });
  return data;
} 