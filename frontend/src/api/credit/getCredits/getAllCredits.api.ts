import { AxiosInstance, AxiosResponse } from 'axios';

import { GetCreditResponseApi } from './apiTypes.server';

export const getAllCreditsApi = async (
  api: AxiosInstance,
  page: number,
  pageSize: number,
): Promise<GetCreditResponseApi> => {
  const { data } = await api.request<void, AxiosResponse<GetCreditResponseApi>>(
    { method: 'get', url: `/loans?page=${page}&page_size=${pageSize}` },
  );

  return data;
};
