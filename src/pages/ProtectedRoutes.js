import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import useEffectOnce from '@hooks/useEffectOnce';
import { userService } from '@services/api/user/user.service';
import { addUser } from '@redux/reducers/user/user.reducer';
import { ROUTES } from '@root/constants';

const ProtectedRoutes = ({ children }) => {
  const dispatch = useDispatch();
  const { token, profile } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      if (token && profile) {
        setIsLoading(false);
        return;
      }

      setTimeout(async () => {
        const response = await userService.checkCurrentUser();
        dispatch(addUser({ token: response.data.token, profile: response.data.user }));
        setIsLoading(false);
      }, 2000)

    } catch (error) {
      setIsLoading(false);
    }
  }, [dispatch, token, profile]);

  useEffectOnce(() => {
    checkUser();
  });

  if (isLoading || (token && profile)) {
    return <>{children}</>;
  }

  return <Navigate to={ROUTES.AUTH} />;
};

export default ProtectedRoutes;
