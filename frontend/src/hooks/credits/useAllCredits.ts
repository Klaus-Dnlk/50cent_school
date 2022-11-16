import { useQuery, UseQueryOptions } from 'react-query';

import { Api, ApiTypes } from '@/api';
import { cacheKeys } from './credits.cacheKeys';
import { TablePaginationConfig } from 'antd/es/table';

export const useAllCredits = (
  //   page: number,
  //   pageSize: number,
  pagination: TablePaginationConfig,
  options?: Omit<
    UseQueryOptions<ApiTypes.GetCreditResponseWithKeys, unknown>,
    'queryFn' | 'queryKey'
  >,
) => {
  const { data } = useQuery(cacheKeys.credits(pagination), async () => {
    return await Api.getAllCredits(
      pagination.current ? pagination.current : 1,
      pagination.pageSize ? pagination.pageSize : 5,
    );
  });

  return {
    totalPages: data?.totalPages,
    loans: data?.data,
  };
};
