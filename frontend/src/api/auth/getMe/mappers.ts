import { GetMeResponse } from './apiTypes';
import { GetMeResponseApi } from './apiTypes.server';

export const mapResponse = (responseApi: GetMeResponseApi): GetMeResponse => ({
  data: {
    id: responseApi.id,
    email: responseApi.email,
    phone: responseApi.phone,
  },
});
