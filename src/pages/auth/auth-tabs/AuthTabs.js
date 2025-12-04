import './AuthTabs.scss';
import backgroundImage from '../../../assets/images/background.jpg';
import { useState } from 'react';
import {Register, Login} from '../index';

const AuthTabs = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="container-wrapper"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="environment">DEV</div>
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
