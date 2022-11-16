import { LoginRequest, LoginResponse } from './apiTypes';
import { LoginRequestApi, LoginResponseApi } from './apiTypes.server';

export function mapRequest(request: LoginRequest): LoginRequestApi {
  return {
    email: request.email,
    password: request.password,
  };
}

export function mapResponse(responseApi: LoginResponseApi): LoginResponse {
  return {
    jwtToken: responseApi.token,
    typesMFA: responseApi.typesMFA,
  };
}
