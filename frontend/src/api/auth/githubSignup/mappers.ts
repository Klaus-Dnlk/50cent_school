import { GithubSignupRequest, GithubSignupResponse } from './apiTypes';
import {
  GithubSignupRequestApi,
  GithubSignupResponseApi,
} from './apiTypes.server';

export function mapRequest(
  request: GithubSignupRequest,
): GithubSignupRequestApi {
  return {
    code: request.code,
  };
}

export function mapResponse(
  responseApi: GithubSignupResponseApi,
): GithubSignupResponse {
  return {
    token: responseApi.token,
  };
}
