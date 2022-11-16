import { confirmApi } from './confirm.api';
import { ConfirmRequest, ConfirmResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const confirmRegistration = async (
  getApi: GetApiFunc,
  request: ConfirmRequest,
): Promise<ConfirmResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return confirmApi(api, requestApi).then(mapResponse);
};
