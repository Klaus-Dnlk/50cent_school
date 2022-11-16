import { facebookSignupApi } from './facebookSignup.api';
import { FacebookSignupRequest, FacebookSignupResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const facebookSignup = async (
  getApi: GetApiFunc,
  request: FacebookSignupRequest,
): Promise<FacebookSignupResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return facebookSignupApi(api, requestApi).then(mapResponse);
};
