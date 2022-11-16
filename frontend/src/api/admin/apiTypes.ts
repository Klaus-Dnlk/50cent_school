export const enum roles {
  creditor = 'Позичальник',
  investor = 'Інвестор',
}

export type UI_ROLES = roles | undefined;

export interface User {
  key: number;
  role: roles;
  name: string;
  photo: string;
  passport: string;
  workplace: string;
  property: string;
}
