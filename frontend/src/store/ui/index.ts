import { atom, selector } from 'recoil';

// UI state atoms
export const uiStateAtom = atom<{
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: string;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  loadingStates: Record<string, boolean>;
}>({
  key: 'uiState',
  default: {
    sidebarCollapsed: false,
    theme: 'light',
    language: 'uk',
    notifications: [],
    loadingStates: {},
  },
});

// Derived selectors
export const sidebarCollapsedSelector = selector({
  key: 'sidebarCollapsed',
  get: ({ get }) => {
    const uiState = get(uiStateAtom);
    return uiState.sidebarCollapsed;
  },
});

export const themeSelector = selector({
  key: 'theme',
  get: ({ get }) => {
    const uiState = get(uiStateAtom);
    return uiState.theme;
  },
});

export const notificationsSelector = selector({
  key: 'notifications',
  get: ({ get }) => {
    const uiState = get(uiStateAtom);
    return uiState.notifications;
  },
});

export const loadingStatesSelector = selector({
  key: 'loadingStates',
  get: ({ get }) => {
    const uiState = get(uiStateAtom);
    return uiState.loadingStates;
  },
}); 