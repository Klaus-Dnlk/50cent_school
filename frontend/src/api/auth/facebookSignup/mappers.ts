import { FacebookSignupRequest, FacebookSignupResponse } from './apiTypes';
import {
  FacebookSignupRequestApi,
  FacebookSignupResponseApi,
} from './apiTypes.server';

export function mapRequest(
  request: FacebookSignupRequest,
): FacebookSignupRequestApi {
  return {
    token: request.token,
  };
}

export function mapResponse(
  responseApi: FacebookSignupResponseApi,
): FacebookSignupResponse {
  return {
    token: responseApi.token,
  };
}
