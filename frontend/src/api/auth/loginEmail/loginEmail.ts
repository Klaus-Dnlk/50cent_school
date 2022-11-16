import { loginEmailApi } from './loginEmail.api';
import { LoginEmailResponse } from './apiTypes';
import { mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const loginEmail = async (
  getApi: GetApiFunc,
): Promise<LoginEmailResponse> => {
  const api = await getApi();

  return await loginEmailApi(api).then(mapResponse);
};
