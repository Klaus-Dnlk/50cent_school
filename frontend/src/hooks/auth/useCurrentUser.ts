import { Api, ApiTypes } from '@/api';
import { useQuery, UseQueryOptions } from 'react-query';

import { cacheKeys } from './auth.cacheKeys';

export const useCurrentUser = (
  options?: Omit<
    UseQueryOptions<ApiTypes.GetMeResponse, unknown>,
    'queryFn' | 'queryKey'
  >,
) => {
  const { data, ...rest } = useQuery(
    cacheKeys.currentUser(),
    async () => {
      return await Api.getMe();
    },
    options,
  );

  return {
    currentUser: data?.data,
    ...rest,
  };
};
