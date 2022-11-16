import { AxiosInstance, AxiosResponse } from 'axios';

import {
  LoginConfirmOtpRequestApi,
  LoginConfirmOtpResponseApi,
} from './apiTypes.server';

export const loginConfirmOtpApi = async (
  api: AxiosInstance,
  requestApi: LoginConfirmOtpRequestApi,
): Promise<LoginConfirmOtpResponseApi> => {
  const { data } = await api.request<
    LoginConfirmOtpRequestApi,
    AxiosResponse<LoginConfirmOtpResponseApi>
  >({
    method: 'post',
    url: `/auth/login/confirm/otp`,
    data: requestApi,
  });

  return data;
};
