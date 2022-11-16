export interface CreateCreditRequestApi {
  creditSum: number;
  creditTitle: string;
  creditDesc: string;
  creditTerm: number;
  creditRate: number;
}

export interface CreateCreditResponseApi {
  Loan: string;
}
