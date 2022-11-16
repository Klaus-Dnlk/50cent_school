// export interface ILoan {
//   creditSum: number;
//   creditTitle: string;
//   creditDesc: string;
//   creditTerm: number;
//   creditRate: number;
//   creditEstimate?: number;
// }

export interface IInvestment {
  key: string;
  creditSum: number | string;
  creditTitle: string;
  creditDesc: string;
  creditTerm: number | string;
  creditRate: number;
  creditEstimate: number;
  creditAction?: string;
}
