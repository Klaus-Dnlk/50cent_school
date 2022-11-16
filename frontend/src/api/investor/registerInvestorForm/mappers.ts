import { RegFormRequest, RegFormResponse } from './apiTypes';
import { RegFormRequestApi, RegFormResponseApi } from './apiTypes.server';

export function mapRequest(request: RegFormRequest): RegFormRequestApi {
  return {
    name: request.name,
    surname: request.surname,
    middle_name: request.middleName,
    id_file: request.idFile,
    photo: request.photo,
  };
}

export function mapResponse(responseApi: RegFormResponseApi): RegFormResponse {
  return {
    status: responseApi.status,
  };
}
