import { AxiosInstance, AxiosResponse } from 'axios';

import { LoginRequestApi, LoginResponseApi } from './apiTypes.server';

export const loginApi = async (
  api: AxiosInstance,
  requestApi: LoginRequestApi,
): Promise<LoginResponseApi> => {
  const { data } = await api.request<
    LoginResponseApi,
    AxiosResponse<LoginResponseApi>
  >({
    method: 'post',
    url: `/auth/login`,
    data: requestApi,
  });

  return data;
};
