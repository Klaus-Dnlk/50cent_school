import { loginConfirmPhoneApi } from './loginConfirmPhone.api';
import {
  LoginConfirmPhoneRequest,
  LoginConfirmPhoneResponse,
} from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const loginConfirmPhone = async (
  getApi: GetApiFunc,
  request: LoginConfirmPhoneRequest,
): Promise<LoginConfirmPhoneResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return loginConfirmPhoneApi(api, requestApi).then(mapResponse);
};
