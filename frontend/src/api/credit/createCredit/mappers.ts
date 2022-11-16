import { CreateCreditRequest, CreateCreditResponse } from './apiTypes';
import {
  CreateCreditRequestApi,
  CreateCreditResponseApi,
} from './apiTypes.server';

export function mapRequest(
  request: CreateCreditRequest,
): CreateCreditRequestApi {
  return {
    creditSum: request.creditSum,
    creditTitle: request.creditTitle,
    creditDesc: request.creditDesc,
    creditTerm: request.creditTerm,
    creditRate: request.creditRate,
  };
}

export function mapResponse(
  responseApi: CreateCreditResponseApi,
): CreateCreditResponse {
  return {
    Loan: responseApi.Loan,
  };
}
