import Input from '@components/input/Input'; 
import Button from '@components/button/Button';
import { useState } from 'react';

const EmailInput = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');

  const handleClick = () => {
    if (!email) return; // Basic validation
    onSubmit(email);
  };

  return (
    <div className="forgot-password-step">
      <h3>Forgot Password?</h3>
      <p className="sub-text">Enter your email to receive a reset code.</p>

      <Input
        name="email"
        type="email"
        value={email}
        labelText="Email Address"
        placeholder="Example@email.com"
        handleChange={(e) => setEmail(e.target.value)}
      />

      <Button
        label={isLoading ? 'SENDING...' : 'SEND CODE'}
        className="auth-btn"
        disabled={!email || isLoading}
        handleClick={handleClick}
      />
    </div>
  );
};
export default EmailInput;
