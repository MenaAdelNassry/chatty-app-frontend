import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@root/constants';
import PropTypes from 'prop-types';
import { ToastUtils } from '@services/utils/toast-utils.service';

const VerifiedGuard = ({ children }) => {
  const { profile } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile && !profile.emailVerified) {
      ToastUtils.error('verify your email address first. Redirecting...', { toastId: 'verify-error' });
      navigate(ROUTES.VERIFY_EMAIL);
    }
  }, [profile, navigate]);

  if (profile?.emailVerified) {
    return <>{children}</>;
  } else {
    return null;
  }
};

VerifiedGuard.propTypes = {
  children: PropTypes.node
};

export default VerifiedGuard;
