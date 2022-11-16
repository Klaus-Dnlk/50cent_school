import { AxiosInstance, AxiosResponse } from 'axios';

import {
  CreateCreditRequestApi,
  CreateCreditResponseApi,
} from './apiTypes.server';

export const createCreditApi = async (
  api: AxiosInstance,
  requestApi: CreateCreditRequestApi,
): Promise<CreateCreditResponseApi> => {
  const { data } = await api.request<
    CreateCreditRequestApi,
    AxiosResponse<CreateCreditResponseApi>
  >({
    method: 'post',
    url: `/loans`,
    data: requestApi,
  });

  return data;
};
