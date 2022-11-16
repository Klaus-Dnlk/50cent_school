export interface GetCreditResponseApi {
  TotalPages: number;
  Data: Loan[];
}
export interface Loan {
  ID: number;
  CreditSum: number;
  CreditTitle: string;
  CreditDesc: string;
  CreditTerm: number;
  CreditRate: number;
  ReturnedAmount: number;
  IsReturned: boolean;
  IsAccepted: boolean;
  AcceptedAt: Date;
  ConsumerID: number;
  InvestorID: number;
}
