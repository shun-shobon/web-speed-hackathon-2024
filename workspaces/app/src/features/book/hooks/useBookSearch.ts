import useSWR from 'swr';

import { bookApiClient } from '../apiClient/bookApiClient';

export function useBookSearch(...[options]: Parameters<typeof bookApiClient.search>) {
  return useSWR(bookApiClient.search$$key(options), bookApiClient.search, { suspense: true });
}
