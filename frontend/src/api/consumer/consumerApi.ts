import { GetApiFunc, makeEndpoint } from '@/api/base';
import { create } from './create/create';

export function createConsumerApi(getApi: GetApiFunc) {
  return {
    create: makeEndpoint(create, getApi),
  };
}
