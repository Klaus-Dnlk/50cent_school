import { atom, selector } from 'recoil';
import { User } from '@/models/user.interface';

// Auth state atoms
export const authStateAtom = atom<{
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}>({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    error: null,
  },
});

// Derived selectors
export const isAuthenticatedSelector = selector({
  key: 'isAuthenticated',
  get: ({ get }) => {
    const authState = get(authStateAtom);
    return authState.isAuthenticated;
  },
});

export const currentUserSelector = selector({
  key: 'currentUser',
  get: ({ get }) => {
    const authState = get(authStateAtom);
    return authState.user;
  },
});

export const authTokenSelector = selector({
  key: 'authToken',
  get: ({ get }) => {
    const authState = get(authStateAtom);
    return authState.token;
  },
});

export const authErrorSelector = selector({
  key: 'authError',
  get: ({ get }) => {
    const authState = get(authStateAtom);
    return authState.error;
  },
});

export const authLoadingSelector = selector({
  key: 'authLoading',
  get: ({ get }) => {
    const authState = get(authStateAtom);
    return authState.isLoading;
  },
}); 