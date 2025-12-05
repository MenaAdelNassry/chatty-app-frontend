import { useRoutes } from "react-router-dom";
import { AuthTabs } from "@pages/auth";
import { ROUTES } from '@root/constants/index';
import {ForgotPassword, ResetPassword} from "@pages/auth/index";
import Streams from "@pages/social/streams/Streams";

export const AppRouter = () => {
  const elements = useRoutes([
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
      path: "/app/social/streams",
      element: <Streams />
    },
  ]);

  return elements;
}
