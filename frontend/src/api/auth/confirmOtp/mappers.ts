import { ConfirmOtpRequest, ConfirmOtpResponse } from './apiTypes';
import { ConfirmOtpRequestApi, ConfirmOtpResponseApi } from './apiTypes.server';

export function mapRequest(request: ConfirmOtpRequest): ConfirmOtpRequestApi {
  return {
    code: request.code,
  };
}

export function mapResponse(
  responseApi: ConfirmOtpResponseApi,
): ConfirmOtpResponse {
  return {
    status: responseApi.status,
  };
}
