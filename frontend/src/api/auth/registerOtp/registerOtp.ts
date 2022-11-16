import { registerOtpApi } from './registerOtp.api';
import { RegisterOtpResponse } from './apiTypes';
import { mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const registerOtp = async (
  getApi: GetApiFunc,
): Promise<RegisterOtpResponse> => {
  const api = await getApi();

  return registerOtpApi(api).then(mapResponse);
};
