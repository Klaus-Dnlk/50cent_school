import { LoginConfirmOtpRequest, LoginConfirmOtpResponse } from './apiTypes';
import {
  LoginConfirmOtpRequestApi,
  LoginConfirmOtpResponseApi,
} from './apiTypes.server';

export function mapRequest(
  request: LoginConfirmOtpRequest,
): LoginConfirmOtpRequestApi {
  return {
    code: request.code,
  };
}

export function mapResponse(
  responseApi: LoginConfirmOtpResponseApi,
): LoginConfirmOtpResponse {
  return {
    token: responseApi.token,
  };
}
