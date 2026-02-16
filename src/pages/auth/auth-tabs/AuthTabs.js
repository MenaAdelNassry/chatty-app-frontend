import { useEffect, useState } from 'react';
import { Register, Login } from '@pages/auth/index';
import useLocalStorage from '@hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@root/constants';
import AuthLayout from '@pages/auth/AuthLayout';
import '@pages/auth/auth-tabs/AuthTabs.scss';

const AuthTabs = () => {
  const [type, setType] = useState('Sign In');
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const navigate = useNavigate();

  useEffect(() => {
    if (keepLoggedIn) {
      navigate(ROUTES.SOCIAL_STREAMS);
    }
  }, [keepLoggedIn, navigate]);

  return (
    <AuthLayout>
      <div className="tabs">
        <div className="tabs-auth">
          <ul className="tab-group">
            <li className={`tab ${type === 'Sign In' ? 'active' : ''}`}>
              <button className="login" onClick={() => setType('Sign In')}>
                Sign In
              </button>
            </li>
            <li className={`tab ${type === 'Sign Up' ? 'active' : ''}`}>
              <button className="signup" onClick={() => setType('Sign Up')}>
                Sign Up
              </button>
            </li>
          </ul>

          <div className="tab-item">
            {type === 'Sign In' ? <Login /> : <Register />}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AuthTabs;
