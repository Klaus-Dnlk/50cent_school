import { useMutation, useQueryClient } from 'react-query';

import { Api, ApiTypes } from '@/api';

import { cacheKeys } from './auth.cacheKeys';

export const useLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: ApiTypes.LoginRequest) => {
      return await Api.login(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(cacheKeys.currentUser());
      },
    },
  );

  return mutation;
};
