import { loginApi } from './login.api';
import { LoginRequest, LoginResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const login = async (
  getApi: GetApiFunc,
  request: LoginRequest,
): Promise<LoginResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return await loginApi(api, requestApi).then(mapResponse);
};
