import { atom } from 'recoil';

// some state specific for login page
export const someStateAtom = atom<boolean>({
  key: 'some-state',
  default: false,
});
