import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { appStorage } from '@/services/appStorage';
import { csrfProtection } from '@/utils/security';
import { InputSanitizer } from '@/utils/security';

export type GetApiFunc = () => Promise<AxiosInstance>;

export function createAxiosInstance({
  apiToken,
  baseURL,
}: {
  apiToken: string;
  baseURL: string;
}): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      if (apiToken) {
        config.headers.Authorization = `Bearer ${apiToken}`;
      }

      if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
        const csrfHeaders = csrfProtection.getCSRFHeader();
        Object.assign(config.headers, csrfHeaders);
      }

      if (config.data && typeof config.data === 'object') {
        config.data = InputSanitizer.sanitizeFormData(config.data);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        appStorage.removeApiToken();
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
}

export function makeEndpoint<
  T extends InitialFunc<Parameters<OmitFirstArg<T>>>,
>(func: T, getApi: GetApiFunc): OmitFirstArg<T> {
  return ((...args: Parameters<OmitFirstArg<T>>) => {
    return getApi().then((api) => func(api, ...args));
  }) as OmitFirstArg<T>;
}

type InitialFunc<T extends any[]> = (api: AxiosInstance, ...args: T) => any;
type OmitFirstArg<T> = T extends [any, ...infer Rest] ? Rest : never;
