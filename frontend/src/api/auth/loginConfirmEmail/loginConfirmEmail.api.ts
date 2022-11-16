import { AxiosInstance, AxiosResponse } from 'axios';

import {
  LoginConfirmEmailRequestApi,
  LoginConfirmEmailResponseApi,
} from './apiTypes.server';

export const loginConfirmEmailApi = async (
  api: AxiosInstance,
  requestApi: LoginConfirmEmailRequestApi,
): Promise<LoginConfirmEmailResponseApi> => {
  const { data } = await api.request<
    LoginConfirmEmailRequestApi,
    AxiosResponse<LoginConfirmEmailResponseApi>
  >({
    method: 'post',
    url: `/auth/login/confirm/email`,
    data: requestApi,
  });

  return data;
};
