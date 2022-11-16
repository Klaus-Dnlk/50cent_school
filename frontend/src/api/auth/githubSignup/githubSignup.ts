import { githubSignupApi } from './githubSignup.api';
import { GithubSignupRequest, GithubSignupResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const githubSignup = async (
  getApi: GetApiFunc,
  request: GithubSignupRequest,
): Promise<GithubSignupResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return githubSignupApi(api, requestApi).then(mapResponse);
};
