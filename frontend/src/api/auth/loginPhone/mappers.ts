import { LoginPhoneResponse } from './apiTypes';
import { LoginPhoneResponseApi } from './apiTypes.server';

export function mapResponse(
  responseApi: LoginPhoneResponseApi,
): LoginPhoneResponse {
  return {
    status: responseApi.status,
  };
}
