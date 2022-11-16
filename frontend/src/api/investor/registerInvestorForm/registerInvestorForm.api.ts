import { RcFile } from 'antd/lib/upload';
import { AxiosInstance, AxiosResponse } from 'axios';
import { RegFormRequestApi, RegFormResponseApi } from './apiTypes.server';

export const registerInvestorFormApi = async (
  api: AxiosInstance,
  requestApi: RegFormRequestApi,
): Promise<RegFormResponseApi> => {
  const form = new FormData();

  form.append('name', requestApi.name);
  form.append('surname', requestApi.surname);
  form.append('middleName', requestApi.middle_name);
  form.append('photo', requestApi.photo as RcFile);
  form.append('idFile', requestApi.id_file as RcFile);

  const { data } = await api.request<
    RegFormRequestApi,
    AxiosResponse<RegFormResponseApi>
  >({
    method: 'post',
    url: `/auth/registration/investor`,
    data: requestApi,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
