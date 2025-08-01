import { atom, selector } from 'recoil';

// Consumer state atoms
export const consumerStateAtom = atom<{
  consumers: Array<{
    id: string;
    name: string;
    surname: string;
    middleName: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
  }>;
  selectedConsumer: any | null;
  formData: {
    name: string;
    surname: string;
    middleName: string;
    photo: File | null;
    work_file: File | null;
    id_file: File | null;
    property_file: File | null;
  };
  isLoading: boolean;
  error: string | null;
}>({
  key: 'consumerState',
  default: {
    consumers: [],
    selectedConsumer: null,
    formData: {
      name: '',
      surname: '',
      middleName: '',
      photo: null,
      work_file: null,
      id_file: null,
      property_file: null,
    },
    isLoading: false,
    error: null,
  },
});

// Derived selectors
export const consumersSelector = selector({
  key: 'consumers',
  get: ({ get }) => {
    const consumerState = get(consumerStateAtom);
    return consumerState.consumers;
  },
});

export const selectedConsumerSelector = selector({
  key: 'selectedConsumer',
  get: ({ get }) => {
    const consumerState = get(consumerStateAtom);
    return consumerState.selectedConsumer;
  },
});

export const consumerFormDataSelector = selector({
  key: 'consumerFormData',
  get: ({ get }) => {
    const consumerState = get(consumerStateAtom);
    return consumerState.formData;
  },
});

export const consumerLoadingSelector = selector({
  key: 'consumerLoading',
  get: ({ get }) => {
    const consumerState = get(consumerStateAtom);
    return consumerState.isLoading;
  },
});

export const consumerErrorSelector = selector({
  key: 'consumerError',
  get: ({ get }) => {
    const consumerState = get(consumerStateAtom);
    return consumerState.error;
  },
}); 