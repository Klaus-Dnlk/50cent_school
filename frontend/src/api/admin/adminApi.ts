import { GetApiFunc, makeEndpoint } from '@/api/base';
import { getUsers } from '@/api/admin/getUsers/getUsers';
import { reviewUser } from '@/api/admin/reviewUser/reviewUser';

export function createAdminApi(getApi: GetApiFunc) {
  return {
    getUsers: makeEndpoint(getUsers, getApi),
    reviewUser: makeEndpoint(reviewUser, getApi),
  };
}
