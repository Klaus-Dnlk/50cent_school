import { AxiosInstance, AxiosResponse } from 'axios';

import { ConfirmOtpRequestApi, ConfirmOtpResponseApi } from './apiTypes.server';

export const confirmOtpApi = async (
  api: AxiosInstance,
  requestApi: ConfirmOtpRequestApi,
): Promise<ConfirmOtpResponseApi> => {
  const { data } = await api.request<
    ConfirmOtpRequestApi,
    AxiosResponse<ConfirmOtpResponseApi>
  >({
    method: 'post',
    url: `/auth/registration/otp/confirm`,
    data: requestApi,
  });

  return data;
};
