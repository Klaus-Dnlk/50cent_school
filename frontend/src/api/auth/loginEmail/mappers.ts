import { LoginEmailResponse } from './apiTypes';
import { LoginEmailResponseApi } from './apiTypes.server';

export function mapResponse(
  responseApi: LoginEmailResponseApi,
): LoginEmailResponse {
  return {
    status: responseApi.status,
  };
}
