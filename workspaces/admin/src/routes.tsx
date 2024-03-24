import { createBrowserRouter, createRoutesFromElements, redirect, Route } from 'react-router-dom';

import { authApiClient } from './features/auth/apiClient/authApiClient';
import { CommonLayout } from './foundation/layouts/CommonLayout';
import { queryClient } from './lib/api/queryClient';
import { AuthPage } from './pages/AuthPage';
import { AuthorListPage } from './pages/AuthorListPage';
import { BookListPage } from './pages/BookListPage';
import { EpisodeCreatePage } from './pages/EpisodeCreatePage';
import { EpisodeDetailPage } from './pages/EpisodeDetailPage';

async function authGuard(): Promise<Response | null> {
  const user = await queryClient.fetchQuery({
    queryFn: async () => {
      try {
        const user = await authApiClient.fetchAuthUser();
        return user;
      } catch (_err) {
        return null;
      }
    },
    queryKey: authApiClient.fetchAuthUser$$key(),
  });

  if (user == null) {
    return redirect('/admin');
  }

  return null;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<CommonLayout />} path={'/'}>
      <Route element={<AuthPage />} path={'/admin'} />
      <Route element={<AuthorListPage />} loader={authGuard} path={'/admin/authors'} />
      <Route element={<BookListPage />} loader={authGuard} path={'/admin/books'} />
      <Route element={<EpisodeDetailPage />} loader={authGuard} path={'/admin/books/:bookId/episodes/:episodeId'} />
      <Route element={<EpisodeCreatePage />} loader={authGuard} path={'/admin/books/:bookId/episodes/new'} />
    </Route>,
  ),
);
