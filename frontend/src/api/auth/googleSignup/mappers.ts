import { GoogleSignupRequest, GoogleSignupResponse } from './apiTypes';
import {
  GoogleSignupRequestApi,
  GoogleSignupResponseApi,
} from './apiTypes.server';

export function mapRequest(
  request: GoogleSignupRequest,
): GoogleSignupRequestApi {
  return {
    token: request.token,
    clientId: request.clientId,
  };
}

export function mapResponse(
  responseApi: GoogleSignupResponseApi,
): GoogleSignupResponse {
  return {
    token: responseApi.token,
  };
}
