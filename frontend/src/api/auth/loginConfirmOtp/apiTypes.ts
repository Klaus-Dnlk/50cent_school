export interface LoginConfirmOtpRequest {
  code: number;
}

export interface LoginConfirmOtpResponse {
  token: string;
}
