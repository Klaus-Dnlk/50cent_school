import {
  CreateRequestApi,
  CreateResponseApi,
} from '@/api/consumer/create/apiTypes.server';
import { CreateRequest, CreateResponse } from '@/api/consumer/create/apiTypes';

export function mapRequest(request: CreateRequest): CreateRequestApi {
  return {
    name: request.name,
    surname: request.surname,
    middleName: request.middleName,
    photo: request.photo,
    work_file: request.work_file,
    id_file: request.id_file,
    property_file: request.property_file,
  };
}

export function mapResponse(response: CreateResponse): CreateResponseApi {
  return {
    status: response.status,
  };
}
