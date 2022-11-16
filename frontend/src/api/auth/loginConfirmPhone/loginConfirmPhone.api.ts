import { AxiosInstance, AxiosResponse } from 'axios';

import {
  LoginConfirmPhoneRequestApi,
  LoginConfirmPhoneResponseApi,
} from './apiTypes.server';

export const loginConfirmPhoneApi = async (
  api: AxiosInstance,
  requestApi: LoginConfirmPhoneRequestApi,
): Promise<LoginConfirmPhoneResponseApi> => {
  const { data } = await api.request<
    LoginConfirmPhoneRequestApi,
    AxiosResponse<LoginConfirmPhoneResponseApi>
  >({
    method: 'post',
    url: `/auth/login/confirm/phone`,
    data: requestApi,
  });

  return data;
};
