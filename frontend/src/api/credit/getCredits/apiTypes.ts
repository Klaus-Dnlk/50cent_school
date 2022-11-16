import { Loan } from './apiTypes.server';

export interface LoanWithKeys extends Loan {
  key: string;
  CreditAction?: string;
}
export interface GetCreditResponseWithKeys {
  totalPages: number;
  data: Omit<LoanWithKeys, 'ID'>[];
}
