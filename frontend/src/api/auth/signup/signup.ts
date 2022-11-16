import { signupApi } from './signup.api';
import { SignupRequest, SignupResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const signup = async (
  getApi: GetApiFunc,
  request: SignupRequest,
): Promise<SignupResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return signupApi(api, requestApi).then(mapResponse);
};
