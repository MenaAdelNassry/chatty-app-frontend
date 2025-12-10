import backgroundImage from '@assets/images/background.jpg';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ROUTES } from '@root/constants';
import '@pages/auth/reset-password/ResetPassword.scss';
import { useState } from 'react';
import { authService } from '@services/api/auth/auth.service';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [searchParams] = useSearchParams();

  const resetPassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const token = searchParams.get('token');
      const result = await authService.resetPassword(token, {
        password,
        confirmPassword,
      });

      setIsLoading(false);
      setPassword('');
      setConfirmPassword('');
      setAlertType('alert-success');
      setResponseMessage(result.data.message);
    } catch (error) {
      setIsLoading(false);
      setAlertType('alert-error');
      setResponseMessage(error?.response?.data.message);
    }
  };

  return (
    <div
      className="container-wrapper"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container-wrapper-auth">
        <div className="tabs reset-password-tabs">
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login reset-password">Reset Password</div>
              </li>
            </ul>
            <div className="tab-item">
              <div className="auth-inner">
                {responseMessage && (
                  <div className={`alerts ${alertType}`} role="alert">
                    {responseMessage}
                  </div>
                )}
                <form className="reset-password-form" onSubmit={resetPassword}>
                  <div className="form-input-container">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      labelText="New Password"
                      placeholder="New Password"
                      style={{ border: alertType === 'alert-error' ? '1px solid #fa9b8a' : '' }}
                      handleChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                      id="cpassword"
                      name="cpassword"
                      type="password"
                      value={confirmPassword}
                      labelText="Confirm Password"
                      placeholder="Confirm Password"
                      style={{ border: alertType === 'alert-error' ? '1px solid #fa9b8a' : '' }}
                      handleChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    label={`${isLoading ? 'RESET PASSWORD IN PROGRESS...' : 'RESET PASSWORD'}`}
                    className="auth-button button"
                    disabled={!password || !confirmPassword}
                    type={'submit'}
                  />

                  <Link to={`${ROUTES.AUTH}`}>
                    <span className="login">
                      <FaArrowLeft className="arrow-left" /> Back to Login
                    </span>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
