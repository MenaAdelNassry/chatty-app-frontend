import '@pages/auth/register/Register.scss';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import useRegister from '@hooks/auth/useRegister';
import { useEffect, useRef } from 'react';

const Register = () => {
  const { values, errors, apiError, isLoading, handleChange, registerUser } =
    useRegister();

  // refs
  // fieldsRef.current = { username: inputElement, email: inputElement, ... }
  const fieldsRef = useRef({});

  // Focus on mount
  useEffect(() => {
    if (fieldsRef.current.username) fieldsRef.current.username.focus();
  }, []);

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = await registerUser(event);

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

      <form className="auth-form" onSubmit={handleRegisterSubmit}>
        <div className="form-input-container">
          <Input
            ref={(el) => (fieldsRef.current['username'] = el)}
            id="username"
            name="username"
            type="text"
            value={values.username}
            labelText="Username"
            placeholder="Enter Username"
            errorMessage={errors.username} // Joi Error
            handleChange={handleChange} // Hook Function
          />
          <Input
            ref={(el) => (fieldsRef.current['email'] = el)}
            id="email"
            name="email"
            type="email"
            value={values.email}
            labelText="Email"
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
        </div>

        <Button
          label={isLoading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}
          className="auth-button button"
          disabled={
            !values.username || !values.email || !values.password || isLoading
          }
          type="submit"
        />
      </form>
    </div>
  );
};

export default Register;
