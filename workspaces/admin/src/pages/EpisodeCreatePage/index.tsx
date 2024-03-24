import { CircularProgress, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useBook } from '../../features/books/hooks/useBook';
import { EpisodeDetailEditor } from '../../features/episodes/components/EpisodeDetailEditor';

export const EpisodeCreatePage: React.FC = () => {
  const { bookId } = useParams();
  invariant(bookId);

  const { data: book } = useBook({ bookId });

  if (book == null) {
    return (
      <Flex align="center" height="100%" justify="center" width="100%">
        <CircularProgress isIndeterminate flexGrow={0} flexShrink={0} size={120} />
      </Flex>
    );
  }

  return <EpisodeDetailEditor book={book} />;
};
