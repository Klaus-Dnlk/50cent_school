import { RegisterOtpResponse } from './apiTypes';
import { RegisterOtpResponseApi } from './apiTypes.server';

export function mapResponse(
  responseApi: RegisterOtpResponseApi,
): RegisterOtpResponse {
  return {
    code: responseApi.code,
  };
}
