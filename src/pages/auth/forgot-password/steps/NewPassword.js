import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { useState } from 'react';
import { ToastUtils } from '@services/utils/toast-utils.service';

const NewPassword = ({ onSubmit, isLoading }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validate = () => {
    // 🔥 Joi Mirror Validation: min(7), max(20)
    if (password.length < 7 || password.length > 20) {
      ToastUtils.error('Password must be between 7 and 20 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      ToastUtils.error('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleClick = () => {
    if (validate()) onSubmit(password, confirmPassword);
  };

  return (
    <div className="forgot-password-step">
      <h3>Reset Password</h3>
      <p className="sub-text">Create a new strong password.</p>

      <Input
        name="password"
        type="password"
        value={password}
        labelText="New Password"
        handleChange={(e) => setPassword(e.target.value)}
      />

      <Input
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        labelText="Confirm Password"
        handleChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        label={isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
        className="auth-btn"
        disabled={!password || !confirmPassword || isLoading}
        handleClick={handleClick}
      />
    </div>
  );
};
export default NewPassword;
