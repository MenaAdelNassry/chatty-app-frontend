import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthTabs, ForgotPassword } from '@pages/auth';
import { ROUTES } from '@root/constants/index';
import ProtectedRoutes from '@pages/ProtectedRoutes';
import Error from '@pages/error/Error';
import Playground from '@components/Playground';
import PageLoader from '@components/page-loader/PageLoader';
import VerifiedGuard from '@pages/VerifiedGuard';
// import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
import SocialSkeleton from '@pages/social/SocialSkeleton';

const Social = lazy(() => import('@pages/social/Social'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Connections = lazy(() => import('@pages/social/connections/Connections'));
const Notifications = lazy(() =>
  import('@pages/social/notifications/Notifications')
);
const People = lazy(() => import('@pages/social/people/People'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));
const Profile = lazy(() => import('@pages/social/profile/Profile'));
const Videos = lazy(() => import('@pages/social/videos/Videos'));
const VerifyEmail = lazy(() => import('@pages/auth/verifyEmail/verifyEmail'));
const Settings = lazy(() => import('@pages/social/settings/Settings'));
const Search = lazy(() => import('@pages/social/search/Search'));

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: '/test',
      element: <Playground />,
    },
    {
      path: ROUTES.AUTH,
      element: <AuthTabs />,
    },
    {
      path: ROUTES.FORGOT_PASSWORD,
      element: <ForgotPassword />,
    },
    {
      path: ROUTES.VERIFY_EMAIL,
      element: (
        <ProtectedRoutes>
          <Suspense fallback={<PageLoader />}>
            <VerifyEmail />
          </Suspense>
        </ProtectedRoutes>
      ),
    },
    {
      path: ROUTES.SOCIAL,
      element: (
        <ProtectedRoutes>
          <VerifiedGuard>
            <Suspense fallback={<SocialSkeleton />}>
              <Social />
            </Suspense>
          </VerifiedGuard>
        </ProtectedRoutes>
      ),
      children: [
        {
          path: ROUTES.SOCIAL_STREAMS,
          element: (
            // TODO we will put StreamsSkeleton after we build it
            <Suspense fallback={<PageLoader />}>
              <Streams />
            </Suspense>
          ),
        },
        {
          path: ROUTES.SOCIAL_CHAT_MESSAGES,
          element: <Chat />,
        },
        {
          path: ROUTES.SOCIAL_CONNECTIONS,
          element: <Connections />,
        },
        {
          path: ROUTES.SOCIAL_NOTIFICATIONS,
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notifications />
            </Suspense>
          ),
        },
        {
          path: ROUTES.SOCIAL_PEOPLE,
          element: (
            <Suspense fallback={<PageLoader />}>
              <People />
            </Suspense>
          ),
        },
        {
          path: ROUTES.SOCIAL_PHOTOS,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Photos />
            </Suspense>
          ),
        },
        {
          path: ROUTES.SOCIAL_PROFILE,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          ),
        },
        {
          path: ROUTES.SOCIAL_VIDEOS,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Videos />
            </Suspense>
          ),
        },
        {
          path: ROUTES.SOCIAL_SETTINGS,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          ),
        },
        {
          path: ROUTES.SOCIAL_SEARCH,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Search />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Error />,
    },
  ]);

  return elements;
};
