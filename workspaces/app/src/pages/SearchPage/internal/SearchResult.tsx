import { memo } from 'react';

import { BookListItem } from '../../../features/book/components/BookListItem';
import { useBookList } from '../../../features/book/hooks/useBookList';
import { Text } from '../../../foundation/components/Text';
import { Color, Typography } from '../../../foundation/styles/variables';

type Props = {
  keyword: string;
};

export const SearchResult: React.FC<Props> = memo(({ keyword }: Props) => {
  const { data: books } = useBookList({ query: { limit: 30, name: keyword } });

  if (books.length === 0) {
    return (
      <Text color={Color.MONO_100} typography={Typography.NORMAL14}>
        関連作品は見つかりませんでした
      </Text>
    );
  }

  return (
    <>
      {books.map((book) => (
        <BookListItem key={book.id} book={book} />
      ))}
    </>
  );
});

SearchResult.displayName = 'SearchResult';
