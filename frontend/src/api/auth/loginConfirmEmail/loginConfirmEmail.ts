import { loginConfirmEmailApi } from './loginConfirmEmail.api';
import {
  LoginConfirmEmailRequest,
  LoginConfirmEmailResponse,
} from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const loginConfirmEmail = async (
  getApi: GetApiFunc,
  request: LoginConfirmEmailRequest,
): Promise<LoginConfirmEmailResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return loginConfirmEmailApi(api, requestApi).then(mapResponse);
};
