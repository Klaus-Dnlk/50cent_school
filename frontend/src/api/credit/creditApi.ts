import { GetApiFunc, makeEndpoint } from '../base';
import { createCredit } from './createCredit/createCredit';
import { getAllCredits } from './getCredits';

export function createCreditApi(getApi: GetApiFunc) {
  return {
    createCredit: makeEndpoint(createCredit, getApi),
    getAllCredits: makeEndpoint(getAllCredits, getApi),
  };
}
