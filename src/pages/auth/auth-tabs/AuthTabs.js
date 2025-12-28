import '@pages/auth/auth-tabs/AuthTabs.scss';
import backgroundImage from '@assets/images/background.jpg';
import { useEffect, useState } from 'react';
import {Register, Login} from '@pages/auth/index';
import { Utils } from '@services/utils/utils.services';
import useLocalStorage from '@hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@root/constants';

const AuthTabs = () => {
  const [isLogin, setIsLogin] = useState(true);

  const keepLoggedIn = useLocalStorage("keepLoggedIn", "get");

  const navigate = useNavigate();

  useEffect(() => {
    if(keepLoggedIn) {
      navigate(ROUTES.SOCIAL_STREAMS);
    }
  }, [keepLoggedIn, navigate]);

  return (
    <div
      className="container-wrapper"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="environment">{ Utils.appEnvironment() }</div>
      <div className="container-wrapper-auth">
        <div className="tabs">
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className={`tab ${isLogin ? 'active' : ''}`}>
                <button
                  className="login"
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </button>
              </li>
              <li className={`tab ${!isLogin ? 'active' : ''}`}>
                <button
                  className="signup"
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </li>
            </ul>
            {isLogin && (
              <div className="tab-item">
                <Login />
              </div>
            )}
            {!isLogin && (
              <div className="tab-item">
                <Register />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;
