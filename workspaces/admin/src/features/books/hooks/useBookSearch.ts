import { useQuery } from '@tanstack/react-query';

import { bookApiClient } from '../apiClient/bookApiClient';

export const useBookSearch = ({
  authorId,
  authorName,
  bookId,
  name,
}: {
  authorId?: string | undefined;
  authorName?: string | undefined;
  bookId?: string | undefined;
  name?: string | undefined;
}) => {
  return useQuery({
    queryFn: async ({ queryKey: [, options] }) => {
      return bookApiClient.search(options);
    },
    queryKey: bookApiClient.search$$key({
      query: {
        authorId,
        authorName,
        bookId,
        name,
      },
    }),
  });
};
