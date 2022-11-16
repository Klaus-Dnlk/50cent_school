import { AxiosInstance, AxiosResponse } from 'axios';
import { UserReviewRequestApi } from '@/api/admin/reviewUser/apiTypes';
import { UserReviewResponseApi } from '@/api/admin/reviewUser/apiTypes.server';

export const userReviewApi = async (
  api: AxiosInstance,
  requestApi: UserReviewRequestApi,
): Promise<UserReviewResponseApi> => {
  const { data } = await api.request<
    UserReviewRequestApi,
    AxiosResponse<UserReviewResponseApi>
  >({
    method: 'post',
    url: `admin/actions/users/${requestApi.accountType}/${requestApi.userId}/${requestApi.action}`,
  });

  return data;
};
