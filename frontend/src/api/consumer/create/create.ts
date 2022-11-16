import { createApi } from './create.api';
import { CreateRequest, CreateResponse } from './apiTypes';
import { GetApiFunc } from '@/api/base';
import { mapRequest, mapResponse } from './mappers';

export const create = async (
  getApi: GetApiFunc,
  request: CreateRequest,
): Promise<CreateResponse> => {
  const requestApi = mapRequest(request);
  const api = await getApi();

  return await createApi(api, requestApi).then(mapResponse);
};
