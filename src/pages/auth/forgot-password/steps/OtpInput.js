import { useState, useEffect } from 'react';
import Button from '@components/button/Button';
import OTPInput from '@components/otp-input/OTPInput';
import useTimer from '@hooks/auth/useTimer';
import PropTypes from 'prop-types';

const OtpInput = ({ email, onSubmit, onResend, isLoading }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));

  const {
    timeRemaining,
    startTimer,
    formatTime
  } = useTimer(60);

  useEffect(() => {
    startTimer();
  }, []); // eslint-disable-line

  const handleResend = () => {
    onResend(email);
    startTimer(60);
    setOtp(Array(6).fill(''));
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    onSubmit(otpString);
  };

  return (
    <div className="forgot-password-step">
      <h3>Verify OTP</h3>
      <p className="sub-text">We sent a 6-digit code to {email}</p>

      <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'center' }}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          autoFocus={true}
        />
      </div>

      <Button
        label={isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
        className="auth-btn"
        disabled={otp.some(digit => !digit) || isLoading}
        handleClick={handleSubmit}
      />

      <div className="resend-wrapper">
        {timeRemaining > 0 ? (
          <span className="timer">Resend code in {formatTime()}</span>
        ) : (
          <span className="resend-link" onClick={handleResend}>Resend Code</span>
        )}
      </div>
    </div>
  );
};

OtpInput.propTypes = {
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  onResend: PropTypes.func,
  isLoading: PropTypes.bool
};

export default OtpInput;
