import { AxiosInstance, AxiosResponse } from 'axios';

import { ConfirmRequestApi, ConfirmResponseApi } from './apiTypes.server';

export const confirmApi = async (
  api: AxiosInstance,
  requestApi: ConfirmRequestApi,
): Promise<ConfirmResponseApi> => {
  const { data } = await api.request<
    ConfirmRequestApi,
    AxiosResponse<ConfirmResponseApi>
  >({
    method: 'post',
    url: `/auth/registration/confirm`,
    data: requestApi,
  });

  return data;
};
