import { AxiosInstance, AxiosResponse } from 'axios';
import { indexedDBService } from '@/services/indexedDB';
import { GetCreditResponseApi } from './apiTypes.server';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getAllCreditsWithCacheApi = async (
  api: AxiosInstance,
  page: number,
  pageSize: number,
): Promise<GetCreditResponseApi> => {
  const cacheKey = `/loans?page=${page}&page_size=${pageSize}`;
  
  try {
    // Try to get cached response first
    const cachedResponse = await indexedDBService.getCachedResponse(cacheKey);
    if (cachedResponse) {
      console.log('Serving credits from cache');
      return cachedResponse;
    }
  } catch (error) {
    console.warn('Failed to get cached response:', error);
  }

  try {
    // Fetch from API
    const { data } = await api.request<void, AxiosResponse<GetCreditResponseApi>>(
      { method: 'get', url: cacheKey },
    );

    // Cache the response
    try {
      await indexedDBService.cacheResponse(cacheKey, data, CACHE_TTL);
      console.log('Cached credits response');
    } catch (cacheError) {
      console.warn('Failed to cache response:', cacheError);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch credits from API:', error);
    throw error;
  }
}; 