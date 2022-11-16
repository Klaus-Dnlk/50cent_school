export interface LoginRequestApi {
  email: string;
  password: string;
}

export interface LoginResponseApi {
  token: string;
  typesMFA: string[];
}
