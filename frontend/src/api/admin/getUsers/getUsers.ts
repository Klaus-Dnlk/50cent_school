import { getUsersApi } from '@/api/admin/getUsers/getUsers.api';
import { mapUnverifiedUsers } from '@/api/admin/getUsers/mappers';
import { GetApiFunc } from '@/api/base';
import { User } from '@/api/admin/apiTypes';

export const getUsers = async (getApi: GetApiFunc): Promise<User[]> => {
  const api = await getApi();
  return getUsersApi(api).then((data) => {
    return mapUnverifiedUsers(data.users);
  });
};
