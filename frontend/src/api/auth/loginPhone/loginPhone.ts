import { loginPhoneApi } from './loginPhone.api';
import { LoginPhoneResponse } from './apiTypes';
import { mapResponse } from './mappers';
import { GetApiFunc } from '../../base';

export const loginPhone = async (
  getApi: GetApiFunc,
): Promise<LoginPhoneResponse> => {
  const api = await getApi();

  return await loginPhoneApi(api).then(mapResponse);
};
