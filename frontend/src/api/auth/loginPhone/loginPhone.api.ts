import { AxiosInstance, AxiosResponse } from 'axios';

import { LoginPhoneResponseApi } from './apiTypes.server';

export const loginPhoneApi = async (
  api: AxiosInstance,
): Promise<LoginPhoneResponseApi> => {
  const { data } = await api.request<
    unknown,
    AxiosResponse<LoginPhoneResponseApi>
  >({
    method: 'post',
    url: `/auth/login/phone`,
    data: {},
  });

  return data;
};
