import { createCreditApi } from './createCredit.api';
import { CreateCreditRequest, CreateCreditResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const createCredit = async (
  getApi: GetApiFunc,
  request: CreateCreditRequest,
): Promise<CreateCreditResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return await createCreditApi(api, requestApi).then(mapResponse);
};
