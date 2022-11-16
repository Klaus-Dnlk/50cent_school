import { RcFile } from 'antd/lib/upload';
import { AxiosInstance, AxiosResponse } from 'axios';

import { CreateRequestApi, CreateResponseApi } from './apiTypes.server';

export const createApi = async (
  api: AxiosInstance,
  requestApi: CreateRequestApi,
): Promise<CreateResponseApi> => {
  const form = new FormData();
  form.append('name', requestApi.name);
  form.append('surname', requestApi.surname);
  form.append('middleName', requestApi.middleName);
  form.append('photo', requestApi.photo as RcFile);
  form.append('work_file', requestApi.work_file as RcFile);
  form.append('id_file', requestApi.id_file as RcFile);
  form.append('property_file', requestApi.property_file as RcFile);

  const { data } = await api.request<
    CreateRequestApi,
    AxiosResponse<CreateResponseApi>
  >({
    method: 'post',
    url: '/auth/registration/consumer',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};
