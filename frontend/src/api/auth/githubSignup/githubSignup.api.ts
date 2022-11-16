import { AxiosInstance, AxiosResponse } from 'axios';

import {
  GithubSignupRequestApi,
  GithubSignupResponseApi,
} from './apiTypes.server';

export const githubSignupApi = async (
  api: AxiosInstance,
  requestApi: GithubSignupRequestApi,
): Promise<GithubSignupResponseApi> => {
  const { data } = await api.request<
    GithubSignupRequestApi,
    AxiosResponse<GithubSignupResponseApi>
  >({
    method: 'post',
    url: `/auth/registration/github`,
    data: requestApi,
  });

  return data;
};
