import { GetApiFunc, makeEndpoint } from '../base';
import { registerInvestorForm } from './registerInvestorForm/registerInvestorForm';

export function createInvestorApi(getApi: GetApiFunc) {
  return {
    registerInvestorForm: makeEndpoint(registerInvestorForm, getApi),
  };
}
