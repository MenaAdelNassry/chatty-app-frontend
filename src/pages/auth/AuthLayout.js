import PropTypes from 'prop-types';
import { Utils } from '@services/utils/utils.services';
import backgroundImage from '@assets/images/background.jpg';
import '@pages/auth/AuthLayout.scss';

const AuthLayout = ({ children }) => {
  return (
    <div
      className="auth-layout-wrapper"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="environment">{Utils.appEnvironment()}</div>

      <div className="auth-layout-content">
        {children}
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node
};

export default AuthLayout;
