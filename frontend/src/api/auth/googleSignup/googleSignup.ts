import { googleSignupApi } from './googleSignup.api';
import { GoogleSignupRequest, GoogleSignupResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const googleSignup = async (
  getApi: GetApiFunc,
  request: GoogleSignupRequest,
): Promise<GoogleSignupResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return googleSignupApi(api, requestApi).then(mapResponse);
};
