import { Config } from '@/config';
import { appStorage } from '@/services/appStorage';

import { createAxiosInstance, GetApiFunc } from './base';
import { createAuthApi } from './auth';
import { createInvestorApi } from './investor';
import { createConsumerApi } from '@/api/consumer/consumerApi';
import { createCreditApi } from './credit';
import { createAdminApi } from '@/api/admin/adminApi';

function createApi(getAxiosInstance: GetApiFunc) {
  return {
    ...createAuthApi(getAxiosInstance),
    ...createInvestorApi(getAxiosInstance),
    ...createConsumerApi(getAxiosInstance),
    ...createCreditApi(getAxiosInstance),
    ...createAdminApi(getAxiosInstance),
  };
}

export const Api = createApi(async () => {
  const apiToken = (await appStorage.getApiToken()) || '';
  const baseURL = `${Config.API_BASEURL}/api/v1`;

  return createAxiosInstance({ apiToken, baseURL });
});
