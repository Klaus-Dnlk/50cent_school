import { GetMeResponse } from './apiTypes';
import { mapResponse } from './mappers';
import { getMeApi } from './getMe.api';
import { GetApiFunc } from '@/api/base';

export const getMe = async (
  getApi: GetApiFunc,
  apiKey?: string,
): Promise<GetMeResponse> => {
  const api = await getApi();

  return await getMeApi(api, apiKey).then(mapResponse);
};
