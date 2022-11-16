import { AxiosInstance, AxiosResponse } from 'axios';

import {
  GoogleSignupRequestApi,
  GoogleSignupResponseApi,
} from './apiTypes.server';

export const googleSignupApi = async (
  api: AxiosInstance,
  requestApi: GoogleSignupRequestApi,
): Promise<GoogleSignupResponseApi> => {
  const { data } = await api.request<
    GoogleSignupRequestApi,
    AxiosResponse<GoogleSignupResponseApi>
  >({
    method: 'post',
    url: `/auth/registration/google`,
    data: requestApi,
  });

  return data;
};
