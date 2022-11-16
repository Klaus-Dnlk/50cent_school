import { AxiosInstance, AxiosResponse } from 'axios';

import { SignupRequestApi, SignupResponseApi } from './apiTypes.server';

export const signupApi = async (
  api: AxiosInstance,
  requestApi: SignupRequestApi,
): Promise<SignupResponseApi> => {
  const { data } = await api.request<
    SignupRequestApi,
    AxiosResponse<SignupResponseApi>
  >({
    method: 'post',
    url: `/auth/registration`,
    data: requestApi,
  });

  return data;
};
