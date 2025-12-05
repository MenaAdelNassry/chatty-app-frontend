import '@pages/auth/login/Login.scss';
import { FaArrowRight } from 'react-icons/fa';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@root/constants';
import { useEffect, useState } from 'react';
import { authService } from '@services/api/auth/auth.service';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.signIn({
        username,
        password,
      });

      setKeepLoggedIn(keepLoggedIn);
      setUser(result.data.user);
      setHasError(false);
      setAlertType('alert-success');
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data.message);
    }
  };

  useEffect(() => {
    if (isLoading && !user) return;
    if (user) {
      navigate('/app/social/streams');
      setIsLoading(false);
    }
  }, [isLoading, user, navigate]);

  return (
    <div className="auth-inner">
      {hasError && errorMessage && (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      )}

      <form className="auth-form" onSubmit={loginUser}>
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            labelText="Username"
            placeholder="Enter Username"
            handleChange={(e) => setUsername(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="text"
            value={password}
            labelText="Password"
            placeholder="Enter Password"
            handleChange={(e) => setPassword(e.target.value)}
          />
          <label className="checkmark-container" htmlFor="checkbox">
            <Input
              id="checkbox"
              name="checkbox"
              type="checkbox"
              value={keepLoggedIn}
              handleChange={(e) => setKeepLoggedIn(e.target.value)}
            />
            Keep me signed in
          </label>
        </div>

        <Button
          label={`${isLoading ? 'SIGNIN IN PROGRESS...' : 'SIGNIN'}`}
          className="auth-button button"
          disabled={!username || !password}
          type="submit"
        />

        <Link to={ROUTES.FORGOT_PASSWORD}>
          <span className="forgot-password">
            Forgot password? <FaArrowRight className="arrow-right" />
          </span>
        </Link>
      </form>
    </div>
  );
};

export default Login;
