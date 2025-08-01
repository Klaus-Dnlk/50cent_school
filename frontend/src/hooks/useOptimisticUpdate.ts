import { useQueryClient } from 'react-query';
import { useCallback } from 'react';

interface OptimisticUpdateOptions<T> {
  queryKey: string[];
  updateFn: (oldData: T | undefined) => T;
  rollbackOnError?: boolean;
}

export function useOptimisticUpdate<T>() {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback(
    async <TData>(
      options: OptimisticUpdateOptions<TData>,
      mutationFn: () => Promise<TData>
    ) => {
      const { queryKey, updateFn, rollbackOnError = true } = options;

      // Store the previous data for potential rollback
      const previousData = queryClient.getQueryData<TData>(queryKey);

      try {
        // Optimistically update the cache
        queryClient.setQueryData<TData>(queryKey, (oldData) => {
          return updateFn(oldData);
        });

        // Perform the actual mutation
        const result = await mutationFn();

        // Update with the real data from the server
        queryClient.setQueryData<TData>(queryKey, result);

        return result;
      } catch (error) {
        // Rollback on error if enabled
        if (rollbackOnError && previousData !== undefined) {
          queryClient.setQueryData<TData>(queryKey, previousData);
        }

        // Re-throw the error for handling in the component
        throw error;
      }
    },
    [queryClient]
  );

  const optimisticUpdateList = useCallback(
    async <TData>(
      queryKey: string[],
      updateFn: (item: TData) => TData,
      filterFn: (item: TData) => boolean,
      mutationFn: () => Promise<void>
    ) => {
      const previousData = queryClient.getQueryData<TData[]>(queryKey);

      try {
        // Optimistically update the list
        queryClient.setQueryData<TData[]>(queryKey, (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((item) => (filterFn(item) ? updateFn(item) : item));
        });

        // Perform the actual mutation
        await mutationFn();

        // Invalidate and refetch to get the latest data
        await queryClient.invalidateQueries(queryKey);
      } catch (error) {
        // Rollback on error
        if (previousData !== undefined) {
          queryClient.setQueryData<TData[]>(queryKey, previousData);
        }
        throw error;
      }
    },
    [queryClient]
  );

  const optimisticAdd = useCallback(
    async <TData>(
      queryKey: string[],
      newItem: TData,
      mutationFn: () => Promise<TData>
    ) => {
      const previousData = queryClient.getQueryData<TData[]>(queryKey);

      try {
        // Optimistically add the new item
        queryClient.setQueryData<TData[]>(queryKey, (oldData) => {
          if (!oldData) return [newItem];
          return [newItem, ...oldData];
        });

        // Perform the actual mutation
        const result = await mutationFn();

        // Update with the real data from the server
        queryClient.setQueryData<TData[]>(queryKey, (oldData) => {
          if (!oldData) return [result];
          return oldData.map((item) => 
            item === newItem ? result : item
          );
        });

        return result;
      } catch (error) {
        // Rollback on error
        if (previousData !== undefined) {
          queryClient.setQueryData<TData[]>(queryKey, previousData);
        }
        throw error;
      }
    },
    [queryClient]
  );

  const optimisticRemove = useCallback(
    async <TData>(
      queryKey: string[],
      filterFn: (item: TData) => boolean,
      mutationFn: () => Promise<void>
    ) => {
      const previousData = queryClient.getQueryData<TData[]>(queryKey);

      try {
        // Optimistically remove the item
        queryClient.setQueryData<TData[]>(queryKey, (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((item) => !filterFn(item));
        });

        // Perform the actual mutation
        await mutationFn();

        // Invalidate and refetch to get the latest data
        await queryClient.invalidateQueries(queryKey);
      } catch (error) {
        // Rollback on error
        if (previousData !== undefined) {
          queryClient.setQueryData<TData[]>(queryKey, previousData);
        }
        throw error;
      }
    },
    [queryClient]
  );

  return {
    optimisticUpdate,
    optimisticUpdateList,
    optimisticAdd,
    optimisticRemove,
  };
} 