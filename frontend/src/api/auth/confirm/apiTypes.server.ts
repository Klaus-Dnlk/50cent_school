export interface ConfirmRequestApi {
  email: string;
  code: number;
}

export interface ConfirmResponseApi {
  status: string;
}
