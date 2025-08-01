import { atom, selector } from 'recoil';
import { Credit } from '@/models/credit.interface';

// Credits state atoms
export const creditsStateAtom = atom<{
  credits: Credit[];
  selectedCredit: Credit | null;
  filters: {
    status: string;
    amount: {
      min: number;
      max: number;
    };
    dateRange: {
      from: string;
      to: string;
    };
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
}>({
  key: 'creditsState',
  default: {
    credits: [],
    selectedCredit: null,
    filters: {
      status: '',
      amount: {
        min: 0,
        max: 1000000,
      },
      dateRange: {
        from: '',
        to: '',
      },
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    isLoading: false,
    error: null,
  },
});

// Derived selectors
export const creditsSelector = selector({
  key: 'credits',
  get: ({ get }) => {
    const creditsState = get(creditsStateAtom);
    return creditsState.credits;
  },
});

export const selectedCreditSelector = selector({
  key: 'selectedCredit',
  get: ({ get }) => {
    const creditsState = get(creditsStateAtom);
    return creditsState.selectedCredit;
  },
});

export const creditsFiltersSelector = selector({
  key: 'creditsFilters',
  get: ({ get }) => {
    const creditsState = get(creditsStateAtom);
    return creditsState.filters;
  },
});

export const creditsPaginationSelector = selector({
  key: 'creditsPagination',
  get: ({ get }) => {
    const creditsState = get(creditsStateAtom);
    return creditsState.pagination;
  },
});

export const filteredCreditsSelector = selector({
  key: 'filteredCredits',
  get: ({ get }) => {
    const creditsState = get(creditsStateAtom);
    const { credits, filters } = creditsState;
    
    return credits.filter(credit => {
      // Apply status filter
      if (filters.status && credit.status !== filters.status) {
        return false;
      }
      
      // Apply amount filter
      if (credit.amount < filters.amount.min || credit.amount > filters.amount.max) {
        return false;
      }
      
      return true;
    });
  },
}); 