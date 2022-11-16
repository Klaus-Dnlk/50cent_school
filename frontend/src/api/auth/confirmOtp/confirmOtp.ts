import { confirmOtpApi } from './confirmOtp.api';
import { ConfirmOtpRequest, ConfirmOtpResponse } from './apiTypes';
import { mapRequest, mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const confirmOtp = async (
  getApi: GetApiFunc,
  request: ConfirmOtpRequest,
): Promise<ConfirmOtpResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return confirmOtpApi(api, requestApi).then(mapResponse);
};
