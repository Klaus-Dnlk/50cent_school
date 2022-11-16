import { ConfirmRequest, ConfirmResponse } from './apiTypes';
import { ConfirmRequestApi, ConfirmResponseApi } from './apiTypes.server';

export function mapRequest(request: ConfirmRequest): ConfirmRequestApi {
  return {
    email: request.email,
    code: request.code,
  };
}

export function mapResponse(responseApi: ConfirmResponseApi): ConfirmResponse {
  return {
    status: responseApi.status,
  };
}
