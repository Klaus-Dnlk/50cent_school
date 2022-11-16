import { AxiosInstance, AxiosResponse } from 'axios';

import { GetUsersResponseApi } from '@/api/admin/apiTypes.server';

export const getUsersApi = async (
  api: AxiosInstance,
): Promise<GetUsersResponseApi> => {
  const { data } = await api.request<
    GetUsersResponseApi,
    AxiosResponse<GetUsersResponseApi>
  >({
    method: 'get',
    url: `/admin/actions/users`,
  });

  return data;
};
