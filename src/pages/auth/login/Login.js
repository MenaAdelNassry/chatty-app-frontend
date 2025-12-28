import '@pages/auth/login/Login.scss';
import { FaArrowRight } from 'react-icons/fa';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@root/constants';
import { useState } from 'react';
import { authService } from '@services/api/auth/auth.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { useDispatch } from 'react-redux';
import { addUser } from '@redux/reducers/user/user.reducer';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const [setStoredUsername] = useLocalStorage("username", "set");
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.signIn({
        username,
        password,
        keepLoggedIn
      });

      setStoredUsername(username);
      setLoggedIn(keepLoggedIn);

      setAlertType('alert-success');
      dispatch(addUser({ token: result.data.token, profile: result.data.user }));

      navigate(ROUTES.SOCIAL_STREAMS);
    } catch (error) {
      setIsLoading(false);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data?.message);
    }
  };

  return (
    <div className="auth-inner">
      {errorMessage && (
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
            style={{ border: `${errorMessage ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(e) => setUsername(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            labelText="Password"
            placeholder="Enter Password"
            style={{ border: `${errorMessage ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(e) => setPassword(e.target.value)}
          />
          <label className="checkmark-container" htmlFor="checkbox">
            <Input
              id="checkbox"
              name="checkbox"
              type="checkbox"
              value={keepLoggedIn}
              handleChange={(e) => setKeepLoggedIn(e.target.checked)}
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
