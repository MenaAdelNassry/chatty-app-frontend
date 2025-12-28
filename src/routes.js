import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { AuthTabs, ForgotPassword, ResetPassword } from "@pages/auth";
import { ROUTES } from '@root/constants/index';
import ProtectedRoutes from "@pages/ProtectedRoutes";
import Error from "@pages/error/Error";
import Playground from "@components/Playground";
import PageLoader from "@components/page-loader/PageLoader"

const Social = lazy(() => import("@pages/social/Social"));
const Streams = lazy(() => import("@pages/social/streams/Streams"));
const Chat = lazy(() => import("@pages/social/chat/Chat"));
const Followers = lazy(() => import("@pages/social/followers/Followers"));
const Following = lazy(() => import("@pages/social/following/Following"));
const Notifications = lazy(() => import("@pages/social/notifications/Notifications"));
const People = lazy(() => import("@pages/social/people/People"));
const Photos = lazy(() => import("@pages/social/photos/Photos"));
const Profile = lazy(() => import("@pages/social/profile/Profile"));
const Videos = lazy(() => import("@pages/social/videos/Videos"));

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: '/test',
      element: <Playground />
    },
    {
      path: ROUTES.AUTH,
      element: <AuthTabs />
    },
    {
      path: ROUTES.FORGOT_PASSWORD,
      element: <ForgotPassword />
    },
    {
      path: ROUTES.RESET_PASSWORD,
      element: <ResetPassword />
    },
    {
      path: ROUTES.SOCIAL,
      element: (
        <ProtectedRoutes>
          <Suspense fallback={<PageLoader />}>
            <Social />
          </Suspense>
        </ProtectedRoutes>
      ),
      children: [
        {
          path: ROUTES.SOCIAL_STREAMS,
          element: <Streams />
        },
        {
          path: ROUTES.SOCIAL_CHAT_MESSAGES,
          element: <Chat />
        },
        {
          path: ROUTES.SOCIAL_FOLLOWERS,
          element: <Followers />
        },
        {
          path: ROUTES.SOCIAL_FOLLOWING,
          element: <Following />
        },
        {
          path: ROUTES.SOCIAL_NOTIFICATIONS,
          element: <Notifications />
        },
        {
          path: ROUTES.SOCIAL_PEOPLE,
          element: <People />
        },
        {
          path: ROUTES.SOCIAL_PHOTOS,
          element: <Photos />
        },
        {
          path: ROUTES.SOCIAL_PROFILE,
          element: <Profile />
        },
        {
          path: ROUTES.SOCIAL_VIDEOS,
          element: <Videos />
        },
      ]
    },
    {
      path: "*",
      element: <Error />
    }
  ]);

  return elements;
}
