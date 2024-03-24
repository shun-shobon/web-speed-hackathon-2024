import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import type { RouteParams } from 'regexparam';
import invariant from 'tiny-invariant';

import { useBook } from '../../features/book/hooks/useBook';
import { EpisodeListItem, EpisodeListItemSkeleton } from '../../features/episode/components/EpisodeListItem';
import { Box } from '../../foundation/components/Box';
import { Flex } from '../../foundation/components/Flex';
import { Separator } from '../../foundation/components/Separator';
import { Space } from '../../foundation/styles/variables';

import { ComicViewer } from './internal/ComicViewer';

const EpisodeDetailPage: React.FC = () => {
  const { bookId, episodeId } = useParams<RouteParams<'/books/:bookId/episodes/:episodeId'>>();
  invariant(bookId);
  invariant(episodeId);

  return (
    <Box>
      <section aria-label="漫画ビューアー">
        <ComicViewer episodeId={episodeId} />
      </section>

      <Separator />

      <Box aria-label="エピソード一覧" as="section" px={Space * 2}>
        <Flex align="center" as="ul" direction="column" justify="center">
          <Suspense
            fallback={Array.from({ length: 10 }).map((_, i) => (
              <EpisodeListItemSkeleton key={i} />
            ))}
          >
            <EpisodeList bookId={bookId} />
          </Suspense>
        </Flex>
      </Box>
    </Box>
  );
};

const EpisodeList: React.FC<{ bookId: string }> = ({ bookId }) => {
  const { data: book } = useBook({ params: { bookId } });

  return (
    <>
      {book.episodes.map((episode) => (
        <EpisodeListItem key={episode.id} bookId={bookId} episode={episode} />
      ))}
    </>
  );
};

const EpisodeDetailPageWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <EpisodeDetailPage />
    </Suspense>
  );
};

export { EpisodeDetailPageWithSuspense as EpisodeDetailPage };
