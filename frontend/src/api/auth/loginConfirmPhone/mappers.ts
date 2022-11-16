import {
  LoginConfirmPhoneRequest,
  LoginConfirmPhoneResponse,
} from './apiTypes';
import {
  LoginConfirmPhoneRequestApi,
  LoginConfirmPhoneResponseApi,
} from './apiTypes.server';

export function mapRequest(
  request: LoginConfirmPhoneRequest,
): LoginConfirmPhoneRequestApi {
  return {
    code: request.code,
  };
}

export function mapResponse(
  responseApi: LoginConfirmPhoneResponseApi,
): LoginConfirmPhoneResponse {
  return {
    token: responseApi.token,
  };
}
