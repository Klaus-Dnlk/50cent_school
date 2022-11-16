import { AxiosInstance, AxiosResponse } from 'axios';

import {
  FacebookSignupRequestApi,
  FacebookSignupResponseApi,
} from './apiTypes.server';

export const facebookSignupApi = async (
  api: AxiosInstance,
  requestApi: FacebookSignupRequestApi,
): Promise<FacebookSignupResponseApi> => {
  const { data } = await api.request<
    FacebookSignupRequestApi,
    AxiosResponse<FacebookSignupResponseApi>
  >({
    method: 'post',
    url: `/auth/registration/facebook`,
    data: requestApi,
  });

  return data;
};
