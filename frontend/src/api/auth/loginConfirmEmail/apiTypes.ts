export interface LoginConfirmEmailRequest {
  code: number;
}

export interface LoginConfirmEmailResponse {
  token: string;
}
