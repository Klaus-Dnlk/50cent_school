import { TablePaginationConfig } from 'antd';

export const cacheKeys = {
  credits: (pagination: TablePaginationConfig) => ['loans', pagination],
} as const;
