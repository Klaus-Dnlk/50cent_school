export interface GetMeResponse {
  data: User;
}

export interface User {
  id: number;
  email: string;
  phone: string;
}
