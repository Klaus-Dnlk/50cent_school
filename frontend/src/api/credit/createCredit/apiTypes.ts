export interface CreateCreditRequest {
  creditSum: number;
  creditTitle: string;
  creditDesc: string;
  creditTerm: number;
  creditRate: number;
}

export interface CreateCreditResponse {
  Loan: string;
}
