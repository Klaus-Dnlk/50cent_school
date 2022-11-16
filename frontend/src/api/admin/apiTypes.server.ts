export const enum backend_roles {
  investor = 1,
  creditor,
}

export interface UserFromBackend {
  ID: number;
  Role: backend_roles;
  Name: string;
  Photo: string;
  Passport: string;
  WorkPlace: string;
  Property: string;
}

export interface GetUsersResponseApi {
  users: UserFromBackend[];
}
