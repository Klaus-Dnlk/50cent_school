import { AxiosInstance, AxiosResponse } from 'axios';

import { LoginEmailResponseApi } from './apiTypes.server';

export const loginEmailApi = async (
  api: AxiosInstance,
): Promise<LoginEmailResponseApi> => {
  const { data } = await api.request<
    unknown,
    AxiosResponse<LoginEmailResponseApi>
  >({
    method: 'post',
    url: `/auth/login/email`,
    data: {},
  });

  return data;
};
