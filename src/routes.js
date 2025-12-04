import { useRoutes } from "react-router-dom";
import { AuthTabs } from "./pages/auth";
import { ROUTES } from './constants/index';
import {ForgotPassword, ResetPassword} from "./pages/auth";

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
  ]);

  return elements;
}
