import {
  mapRequest,
  mapResponse,
} from '@/api/investor/registerInvestorForm/mappers';
import { GetApiFunc } from '@/api/base';
import { registerInvestorFormApi } from './registerInvestorForm.api';
import { RegFormRequest, RegFormResponse } from './apiTypes';

export const registerInvestorForm = async (
  getApi: GetApiFunc,
  request: RegFormRequest,
): Promise<RegFormResponse> => {
  const api = await getApi();
  const requestApi = mapRequest(request);

  return registerInvestorFormApi(api, requestApi).then(mapResponse);
};
