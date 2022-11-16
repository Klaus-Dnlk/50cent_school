import { SignupRequest, SignupResponse } from './apiTypes';
import { SignupRequestApi, SignupResponseApi } from './apiTypes.server';

export function mapRequest(request: SignupRequest): SignupRequestApi {
  return {
    email: request.email,
    password: request.password,
    phone: request.phone,
  };
}

export function mapResponse(responseApi: SignupResponseApi): SignupResponse {
  return {
    status: responseApi.status,
  };
}
