import '@pages/auth/login/Login.scss';
import { FaArrowRight } from 'react-icons/fa';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@root/constants';
import useLogin from '@hooks/auth/useLogin';
import { useEffect, useRef } from 'react';
import GoogleLoginBtn from '@components/button/GoogleLoginBtn';

const Login = () => {
  const { values, errors, apiError, isLoading, handleChange, loginUser } =
    useLogin();

  // refs
  // fieldsRef.current = { email: inputElement, password: inputElement, ... }
  const fieldsRef = useRef({});

  // Focus on mount
  useEffect(() => {
    if (fieldsRef.current.email) fieldsRef.current.email.focus();
  }, []);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = await loginUser(event);

    if (validationErrors) {
      const firstErrorKey = Object.keys(validationErrors)[0];

      if (firstErrorKey && fieldsRef.current[firstErrorKey]) {
        fieldsRef.current[firstErrorKey].focus();
      }
    }
  };

  return (
    <div className="auth-inner">
      {apiError && (
        <div className="alerts alert-error" role="alert">
          {apiError}
        </div>
      )}

      <form className="auth-form" onSubmit={handleLoginSubmit}>
        <div className="form-input-container">
          <Input
            ref={(el) => (fieldsRef.current['email'] = el)}
            id="email"
            name="email"
            type="text"
            value={values.email}
            labelText="email"
            placeholder="Enter Email"
            errorMessage={errors.email}
            handleChange={handleChange}
          />
          <Input
            ref={(el) => (fieldsRef.current['password'] = el)}
            id="password"
            name="password"
            type="password"
            value={values.password}
            labelText="Password"
            placeholder="Enter Password"
            errorMessage={errors.password}
            handleChange={handleChange}
          />

          <label className="checkmark-container" htmlFor="checkbox">
            <Input
              ref={(el) => (fieldsRef.current['checkbox'] = el)}
              id="checkbox"
              name="keepLoggedIn"
              type="checkbox"
              value={values.keepLoggedIn}
              handleChange={handleChange}
            />
            Keep me signed in
          </label>
        </div>

        <Button
          label={isLoading ? 'SIGNIN IN PROGRESS...' : 'SIGNIN'}
          className="auth-button button"
          disabled={!values.email || !values.password || isLoading}
          type="submit"
        />

        <div className="auth-separator">OR</div>

        <GoogleLoginBtn />

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
