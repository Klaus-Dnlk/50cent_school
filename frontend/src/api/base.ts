import axios, { AxiosInstance } from 'axios';

export interface ApiConfig {
  baseURL: string;
  apiToken: string;
}

export type GetApiFunc = () => Promise<AxiosInstance>;

type InitialFunc<T extends unknown[]> = (
  getApi: GetApiFunc,
  ...args: T
) => unknown;

// eslint-disable-next-line
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

export function makeEndpoint<
  T extends InitialFunc<Parameters<OmitFirstArg<T>>>,
>(func: T, getApi: GetApiFunc): OmitFirstArg<T> {
  return ((...args: Parameters<OmitFirstArg<T>>) =>
    func(getApi, ...args)) as OmitFirstArg<T>;
}

export function createAxiosInstance({ baseURL, apiToken }: ApiConfig) {
  return axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  });
}
