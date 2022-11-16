import { AxiosInstance, AxiosResponse } from 'axios';

import { GetMeResponseApi } from './apiTypes.server';

export const getMeApi = async (
  api: AxiosInstance,
  apiKey?: string,
): Promise<GetMeResponseApi> => {
  const config = !apiKey
    ? { method: 'get', url: '/auth/me' }
    : {
        method: 'get',
        url: '/auth/me',
        headers: { api_key: apiKey },
      };

  const { data } = await api.request<
    GetMeResponseApi,
    AxiosResponse<GetMeResponseApi>
  >(config);

  return data;
};
