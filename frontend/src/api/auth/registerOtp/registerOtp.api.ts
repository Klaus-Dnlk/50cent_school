import { AxiosInstance, AxiosResponse } from 'axios';

import { RegisterOtpResponseApi } from './apiTypes.server';

export const registerOtpApi = async (
  api: AxiosInstance,
): Promise<RegisterOtpResponseApi> => {
  const { data } = await api.request<
    unknown,
    AxiosResponse<RegisterOtpResponseApi>
  >({
    method: 'post',
    url: `/auth/registration/otp`,
    data: {},
  });

  return data;
};
