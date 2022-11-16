import { GetApiFunc } from '@/api/base';

import { GetCreditResponseWithKeys } from './apiTypes';
import { getAllCreditsApi } from './getAllCredits.api';
import { mapResponse } from './mappers';

export const getAllCredits = async (
  getApi: GetApiFunc,
  page: number,
  pageSize: number,
): Promise<GetCreditResponseWithKeys> => {
  const api = await getApi();

  return await getAllCreditsApi(api, page, pageSize).then(mapResponse);
};
