import { CircularProgress, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useBook } from '../../features/books/hooks/useBook';
import { EpisodeDetailEditor } from '../../features/episodes/components/EpisodeDetailEditor';
import { useEpisode } from '../../features/episodes/hooks/useEpisode';

export const EpisodeDetailPage: React.FC = () => {
  const { bookId, episodeId } = useParams();
  invariant(bookId);
  invariant(episodeId);

  const { data: book } = useBook({ bookId });
  const { data: episode } = useEpisode({ episodeId });

  if (book == null || episode == null) {
    return (
      <Flex align="center" height="100%" justify="center" width="100%">
        <CircularProgress isIndeterminate flexGrow={0} flexShrink={0} size={120} />
      </Flex>
    );
  }

  return <EpisodeDetailEditor book={book} episode={episode} />;
};
