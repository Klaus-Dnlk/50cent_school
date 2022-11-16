import { GetApiFunc } from '@/api/base';
import { UserReviewRequestApi } from '@/api/admin/reviewUser/apiTypes';
import { UserReviewResponseApi } from '@/api/admin/reviewUser/apiTypes.server';
import { userReviewApi } from '@/api/admin/reviewUser/userReviewApi';

export const reviewUser = async (
  getApi: GetApiFunc,
  request: UserReviewRequestApi,
): Promise<UserReviewResponseApi> => {
  const api = await getApi();

  return userReviewApi(api, request);
};
