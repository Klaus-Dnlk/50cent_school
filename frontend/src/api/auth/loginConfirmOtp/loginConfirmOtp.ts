import { loginConfirmOtpApi } from './loginConfirmOtp.api';
import { LoginConfirmOtpRequest, LoginConfirmOtpResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const loginConfirmOtp = async (
  getApi: GetApiFunc,
  request: LoginConfirmOtpRequest,
): Promise<LoginConfirmOtpResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return loginConfirmOtpApi(api, requestApi).then(mapResponse);
};
