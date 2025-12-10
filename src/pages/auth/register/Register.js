import '@pages/auth/register/Register.scss';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { useEffect, useState } from 'react';
import { Utils } from '@services/utils/utils.services';
import { authService } from '@services/api/auth/auth.service';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from "@hooks/useLocalStorage";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [user, setUser] = useState(null);

  const [setStoredUsername] = useLocalStorage("username", "set");
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");

  const navigate = useNavigate();

  const registerUser = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const avatarColor = Utils.getRandomAvatarColor();
      const avatarImage = Utils.generateAvatarImage(username[0].toUpperCase(), avatarColor);
      const result = await authService.signUp({
        username,
        email,
        password,
        avatarColor,
        avatarImage
      });

      setStoredUsername(username);
      setLoggedIn(true); // default

      setUser(result.data.user);
      setAlertType('alert-success');
      setHasError(false);
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data.message);
    }
  }

  useEffect(() => {
    if(isLoading && !user) return;
    if(user) {
      navigate("/app/social/streams");
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

      <form className="auth-form" onSubmit={registerUser}>
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            labelText="Username"
            placeholder="Enter Username"
            style={{ border: `${hasError ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            id="email"
            name="email"
            type="text"
            value={email}
            labelText="Email"
            placeholder="Enter Email"
            style={{ border: `${hasError ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            labelText="Password"
            placeholder="Enter Password"
            style={{ border: `${hasError ? "1px solid #fa9b8a" : ""}` }}
            handleChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <Button
          label={`${isLoading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}`}
          className="auth-button button"
          disabled={!username || !email || !password}
          type={"submit"}
        />
      </form>
    </div>
  );
};

export default Register;
