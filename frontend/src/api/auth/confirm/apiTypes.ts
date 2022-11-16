export interface ConfirmRequest {
  email: string;
  code: number;
}

export interface ConfirmResponse {
  status: string;
}
