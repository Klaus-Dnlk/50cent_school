import {
  LoginConfirmEmailRequest,
  LoginConfirmEmailResponse,
} from './apiTypes';
import {
  LoginConfirmEmailRequestApi,
  LoginConfirmEmailResponseApi,
} from './apiTypes.server';

export function mapRequest(
  request: LoginConfirmEmailRequest,
): LoginConfirmEmailRequestApi {
  return {
    code: request.code,
  };
}

export function mapResponse(
  responseApi: LoginConfirmEmailResponseApi,
): LoginConfirmEmailResponse {
  return {
    token: responseApi.token,
  };
}
